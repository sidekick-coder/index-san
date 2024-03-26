import HParser from "../HParser"
import HFunction from "../nodes/HFunction"

export type HecateCompiler = ReturnType<typeof createCompiler>

const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor

export function createCompiler() {

    const parser = new HParser()

    function toNodes(code: string) {
        return parser.toNodes(code)
    }

    async function compile(code: string) {
        const nodes = parser.toNodes(code)

        const needExport: string[] = []

        nodes.forEach((node) => {
            if (node instanceof HFunction && node.export) {
                needExport.push(node.name)

                // remove export keyword
                node.tokens.splice(0, 1)
            }
        })

        let codeTransformed = nodes.toText().trim()

        if (needExport.length) {
            codeTransformed += `\n\n\nthis.__HECATE_EXPORT({ ${needExport.join(', ')}})\n\n`
        }

        const result = {
            exports: {} as Record<string, any>,
        }

        const AsyncFunction = Object.getPrototypeOf(async function () {
            /* empty */
        }).constructor

        const fn = new AsyncFunction(codeTransformed)

        const context = {
            __HECATE_EXPORT: (data: any) => {
                result.exports = data
            }
        }

        await fn.call(context)
            .catch((err: Error) => {
                console.error(err)
            })

        return result
    }


    return {
        compile,
        toNodes
    }
}