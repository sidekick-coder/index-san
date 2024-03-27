import HParser from "../HParser"
import HNode from "../base/HNode"
import HFunction from "../nodes/HFunction"
import HImport from "../nodes/HImport"

export type HecateCompiler = ReturnType<typeof createCompiler>

export interface HecateCompilerImportResolver {
    test: (path: string) => boolean
    resolve: (path: string) => Promise<string>
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
            .filter(Boolean).join('\n')
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

        // console.log(nodes)

        // handle imports
        deepForEach(nodes, (node) => {
            if (node instanceof HImport) {
                imports[node.from] = {}

                const replace = `\nconst { ${node.properties.map(p => p.name).join(', ')} } = $hecate.import('${node.from}');`

                transformed = replaceString(transformed, node.start, node.end, replace)

            }
        })

        transformed = minify(transformed)
        nodes = parser.toNodes(transformed)

        console.log(transformed)

        let codeTransformed = '// -------- hecate header -------- //\n\n'

        codeTransformed += '$hecate = this.$hecate\n\n'

        codeTransformed += '// -------- code -------- //\n\n'

        codeTransformed += nodes.toText().trim()

        if (needExport.length) {
            codeTransformed += '\n\n\n// -------- hecate footer -------- //\n\n'

            codeTransformed += `$hecate.export({ ${needExport.join(', ')} })\n\n`
        }

        const result = {
            exports: {} as Record<string, any>,
            error: null as any,
            logs: [] as any[]
        }

        const $hecate = {
            import: async (path: string) => {
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
                    result.logs.push(args)                
                },
            }
        }

        await execute(codeTransformed, { $hecate }).catch((err) => {
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