import { NodeArray } from "@language-kit/core"
import HParser from "../HParser"
import HNode from "../base/HNode"
import HConsole from "../nodes/HConsole"
import HFunction from "../nodes/HFunction"
import HImport from "../nodes/HImport"
import HExportDefaultObject from "../nodes/HExplortDefaultObject"
import HImportDefault from "../nodes/HImportDefault"
import HAsyncFunction from "../nodes/HAsyncFunction"
import HImportInline from "../nodes/HImportInline"
import HVariable from "../nodes/HVariable"

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

const cache = new Map<string, any>()

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
            if ((node as any).children) {
                result.push(...allNodes((node as any).children))
            }
        })

        if (result.length > 2000) {
            console.log('length', result.length, result[0])
            // console.log(result.map(n => n.toText()).join(''))
            // console.log(result)
            throw new Error('Too many nodes')
        }


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
            if (node instanceof HVariable && node.export) {
                const token = node.tokens.find((t) => t.value === 'export')

                if (!token) continue

                const newCode = code.slice(0, token.start) + code.slice(token.end + 1)

                return [true, minify(newCode)]
            }

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

            if (node instanceof HImportInline) {
                const replace = `$hecate.lazyImport('${node.from}');`

                const newCode = code.slice(0, node.start) + replace + code.slice(node.end + 1)

                return [true, minify(newCode)]
            }

        }

        return [false, code]
    }


    async function hexdigest(code: string) {
        const encoder = new TextEncoder()
        const data = encoder.encode(code)

        const hash = await window.crypto.subtle.digest('SHA-256', data)

        return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('')
    }

    async function compile(code: string) {
        const start = Date.now()
        const hash = await hexdigest(code)

        const cached = cache.get(hash)

        if (cached) {
            return cached
        }

        const imports = {} as Record<string, any>

        // register imports & exports
        const exportDefinition: any[] = []

        for (const node of allNodes(parser.toNodes(code))) {
            if (node instanceof HVariable && node.export) {
                exportDefinition.push(node.name)
            }

            if (node instanceof HFunction && node.export) {
                exportDefinition.push(node.name)
            }

            if (node instanceof HAsyncFunction && node.export) {
                exportDefinition.push(node.name)
            }

            if (node instanceof HExportDefaultObject) {
                exportDefinition.push('default: __default')
            }

            if (node instanceof HImport) {
                imports[node.from] = {}
            }

            if (node instanceof HImportDefault) {
                imports[node.from] = {}
            }
        }

        const transformed = transformAll(code, [
            transformExports,
            transformImports,
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

        if (exportDefinition.length) {
            lines.push(
                '// -------- hecate footer -------- //',
                "",
                `$hecate.export({ ${exportDefinition.join(', ')} });`
            )
        }

        const finalCode = lines.join('\n')

        const result = {
            time: 0,
            exports: {} as Record<string, any>,
            error: null as any,
            logs: [] as any[],
            code: finalCode
        }

        for await (const key of Object.keys(imports)) {
            const resolver = importResolvers.find((r) => r.test(key))


            if (!resolver) {
                throw new Error(`[hecate] Import resolver not found for ${key}`)
            }

            imports[key] = await resolver.resolve(key)

            if (result.error) {
                return result
            }
        }

        const $hecate = {
            lazyImport: async (path: string) => {
                const resolver = importResolvers.find((r) => r.test(path))

                if (!resolver) {
                    throw new Error(`[hecate] Import resolver not found for ${path}`)
                }

                return resolver.resolve(path)
            },
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
            console.error('[hecate] Error: ' + err.message, {
                globals: globals,
                stack: err.stack,
                code: finalCode
            })
        })


        if (code.includes('@hecate debug')) {
            console.log('[hecate]', {
                hash: hash,
                globals: globals,
                imports: imports,
                code: finalCode,
                exports: result.exports,
                logs: result.logs,
                nodes: parser.toNodes(code)
            })
        }

        cache.set(hash, result)

        result.time = Date.now() - start
        const basename = globals?.__filename ? globals.__filename.split('/').pop() : 'unknown'

        console.debug('[hecate] compiled in', result.time, 'ms', basename)

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
