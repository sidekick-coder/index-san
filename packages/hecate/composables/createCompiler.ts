import { NodeArray } from "@language-kit/core"
import HParser from "../HParser"
import HNode from "../base/HNode"
import HConsole from "../nodes/HConsole"
import HFunction from "../nodes/HFunction"
import HImport from "../nodes/HImport"
import HExportDefaultObject from "../nodes/HExplortDefaultObject"
import HImportDefault from "../nodes/HImportDefault"
import HAsyncFunction from "../nodes/HAsyncFunction"

export type HecateCompiler = ReturnType<typeof createCompiler>

export type HecateCompilerResult = Awaited<ReturnType<HecateCompiler['compile']>>

export interface HecateCompilerImportResolver {
    test: (path: string) => boolean
    resolve: (path: string) => Promise<any>
}

export interface HecateCompilerLogger {
    log: (...args: any[]) => void
}

export interface HecateCompilerOptions {
    globals?: Record<string, any>,
    importResolvers: HecateCompilerImportResolver[]
    logger?: HecateCompilerLogger
}

export interface HecateCompilerTransformFn {
    (code: string, nodes: NodeArray<HNode>): [boolean, string]
}

const AsyncFunction = Object.getPrototypeOf(async function() { }).constructor

export function createCompiler({ globals, importResolvers, logger }: HecateCompilerOptions) {

    const parser = new HParser()

    function toNodes(code: string) {
        return parser.toNodes(code)
    }

    async function execute(code: string, context: any) {
        try {
            const fn = new AsyncFunction(code)

            await fn.call(context)
                .catch((err: Error) => {
                    console.error(err)
                })
        } catch (error) {
            throw error
        }
    }

    function deepForEach(nodes: HNode[], cb: (node: HNode) => void) {
        nodes.forEach((node) => {
            cb(node)

            if (node instanceof HFunction) {
                deepForEach(node.children, cb)
            }
        })
    }

    function allNodes(nodes: HNode[]) {
        const result = nodes.slice()

        nodes.forEach((node) => {
            if (node instanceof HFunction) {
                result.push(...allNodes(node.children))
            }
        })

        return result
    }

    // remove unnecessary spaces and new lines
    function minify(code: string) {
        return code
            .replaceAll('\r', '\n')
            .split('\n')
            .map((l) => l.trim())
            .filter(Boolean)
            .join('\n')
    }

    // recursively transform the code
    function transform(code: string, cb: HecateCompilerTransformFn) {
        let nodes = parser.toNodes(code)

        const [result, newCode] = cb(code, nodes)

        if (!result) {
            return code
        }

        return transform(newCode, cb)
    }

    function transformAll(code: string, cbs: HecateCompilerTransformFn[]) {
        let transformed = code

        for (const cb of cbs) {
            transformed = transform(transformed, cb)
        }

        return transformed
    }

    // remove exports
    const transformExports: HecateCompilerTransformFn = (code: string, nodes: NodeArray) => {
        for (const node of allNodes(nodes)) {
            if (node instanceof HFunction && node.export) {
                const token = node.tokens.find((t) => t.value === 'export')

                if (!token) continue

                const newCode = code.slice(0, token.start) + code.slice(token.end + 1)

                return [true, minify(newCode)]
            }

            if (node instanceof HAsyncFunction && node.export) {
                const token = node.tokens.find((t) => t.value === 'export')

                if (!token) continue

                const newCode = code.slice(0, token.start) + code.slice(token.end + 1)

                return [true, minify(newCode)]
            }

            if (node instanceof HExportDefaultObject) {
                const replace = `\nconst __default = ${node.value}`

                const newCode = code.slice(0, node.start) + replace + code.slice(node.end + 1)

                return [true, minify(newCode)]
            }

        }

        return [false, code]
    }

    const transformImports: HecateCompilerTransformFn = (code: string, nodes: NodeArray) => {

        for (const node of allNodes(nodes)) {
            if (node instanceof HImport) {
                const replace = `\nconst { ${node.properties.map(p => p.name).join(', ')} } = $hecate.import('${node.from}');\n`

                const newCode = code.slice(0, node.start) + replace + code.slice(node.end + 1)

                return [true, minify(newCode)]
            }

            if (node instanceof HImportDefault) {
                const replace = `\nconst ${node.name} = $hecate.import('${node.from}').default;\n`

                const newCode = code.slice(0, node.start) + replace + code.slice(node.end + 1)

                return [true, minify(newCode)]
            }
        }

        return [false, code]
    }

    const transformConsole: HecateCompilerTransformFn = (code: string, nodes: NodeArray) => {
        for (const node of allNodes(nodes)) {
            if (node instanceof HConsole) {
                const replace = `\n$hecate.console.${node.level}(${node.args.join(', ')});`

                const newCode = code.slice(0, node.start) + replace + code.slice(node.end + 1)

                return [true, minify(newCode)]
            }
        }

        return [false, code]
    }

    async function compile(code: string) {
        const imports = {} as Record<string, any>

        // register imports & exports
        const needExport: string[] = []

        for (const node of allNodes(parser.toNodes(code))) {
            if (node instanceof HFunction && node.export) {
                needExport.push(node.name)
            }

            if (node instanceof HAsyncFunction && node.export) {
                needExport.push(node.name)
            }

            if (node instanceof HExportDefaultObject) {
                needExport.push('default: __default')
            }

            if (node instanceof HImport) {
                imports[node.from] = null
            }

            if (node instanceof HImportDefault) {
                imports[node.from] = null
            }
        }

        const transformed = transformAll(code, [
            transformExports,
            transformImports,
            // transformConsole
        ])

        const globalsVars = Object.entries(globals || {}).map(([k, v]) => `const ${k} = "${v}"`)

        const lines = [
            "// -------- hecate header -------- //",
            "",
            "$hecate = this.$hecate;",
            "",
            ...globalsVars,
            "",
            "// -------- code -------- //",
            "",
            transformed,
        ]

        if (needExport.length) {
            lines.push(
                '// -------- hecate footer -------- //',
                "",
                `$hecate.export({ ${needExport.join(', ')} });`
            )
        }

        const finalCode = lines.join('\n')

        const result = {
            exports: {} as Record<string, any>,
            error: null as any,
            logs: [] as any[],
            code: finalCode
        }

        for await (const key of Object.keys(imports)) {
            const resolver = importResolvers.find((r) => r.test(key))

            if (!resolver) {
                result.error = new Error(`[hecate] Import resolver not found for ${key}`)
                return result
            }

            imports[key] = await resolver.resolve(key)
                .then((data) => data)
                .catch((err) => {
                    console.error(err)
                    result.error = err
                })

            if (result.error) {
                return result
            }
        }

        const $hecate = {
            import: (path: string) => {
                return imports[path]
            },
            export: (data: any) => {
                result.exports = data
            },
            error: (err: Error) => {
                result.error = err
            },
            console: {
                log: (...args: any[]) => {
                    logger?.log(...args)
                    result.logs.push(args)
                },
            }
        }

        await execute(finalCode, { $hecate }).catch((err) => {
            result.error = err
        })

        return result

    }


    return {
        importResolvers,
        minify,
        deepForEach,
        compile,
        toNodes
    }
}
