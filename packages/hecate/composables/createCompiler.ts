import HParser from "../HParser"
import HNode from "../base/HNode"
import HConsole from "../nodes/HConsole"
import HFunction from "../nodes/HFunction"
import HImport from "../nodes/HImport"

export type HecateCompiler = ReturnType<typeof createCompiler>

export type HecateCompilerResult = Awaited<ReturnType<HecateCompiler['compile']>>

export interface HecateCompilerImportResolver {
    test: (path: string) => boolean
    resolve: (path: string) => Promise<any>
}

export interface HecateCompilerOptions {
    importResolvers: HecateCompilerImportResolver[]
}

const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor

export function createCompiler({ importResolvers }: HecateCompilerOptions) {

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

    // remove unnecessary spaces and new lines
    function minify(code: string){
        return code
            .replaceAll('\r', '\n')
            .split('\n')
            .map((l) => l.trim())
            .filter(Boolean)
            .join('\n')
    }

    function replaceString(source: string, start: number, end: number, value = '') {
        return source.slice(0, start) + value + source.slice(end + 1)
    }

    async function compile(code: string) {
        let transformed = minify(code)
        let nodes = parser.toNodes(transformed)

        // handle exports
        const needExport: string[] = []

        deepForEach(nodes, (node) => {
            if (node instanceof HFunction && node.export) {
                needExport.push(node.name)

                // remove export keyword
                const token = node.tokens.find((t) => t.value === 'export')

                if (!token) return
                
                transformed = replaceString(transformed, token.start, token.end)
            }
        })

        transformed = minify(transformed)
        nodes = parser.toNodes(transformed)

        const imports = {} as Record<string, any>

        // handle imports
        deepForEach(nodes, (node) => {
            if (node instanceof HImport) {
                imports[node.from] = null

                const replace = `\nconst { ${node.properties.map(p => p.name).join(', ')} } = $hecate.import('${node.from}');`

                transformed = replaceString(transformed, node.start, node.end, replace)

            }
        })       

        transformed = minify(transformed)
        nodes = parser.toNodes(transformed)

        // handle console.log
        deepForEach(nodes, (node) => {
            if (node instanceof HConsole) {

                const replace = `\n$hecate.console.${node.level}(${node.args.join(', ')});`

                transformed = replaceString(transformed, node.start, node.end, replace)
            }
        })

        transformed = minify(transformed)
        nodes = parser.toNodes(transformed)

        const lines = [
            "// -------- hecate header -------- //",
            "",
            "$hecate = this.$hecate;",
            "",
            "// -------- code -------- //",
            "",
            nodes.toText().trim(),
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
            logs: [] as any[]
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
                    result.logs.push(...args)                
                },
            }
        }

        await execute(finalCode, { $hecate }).catch((err) => {
            result.error = err
        })

        return result

    }


    return {
        deepForEach,
        compile,
        toNodes
    }
}