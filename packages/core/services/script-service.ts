import vm from 'vm'
import util from 'util'

const format = (args: any) => {
    if (typeof args === 'string') {
        return args
    }

    return util.inspect(args)
}

export default class ScriptService {
    protected async _evaluate(code: string, scope?: Record<string, any>) {
        const logs: string[] = []
        let result = null
        let error = null

        const sandbox = {
            setResult: (data: any) => (result = data),
            console: {
                log: (...args: any) => logs.push(args.map(format).join(' ')),
            },
            ...scope,
            main: (): Promise<any> => Promise.resolve('Error executing script'),
        }

        const executable = new vm.Script(`async function main(){ ${code} }`)
        const context = vm.createContext(sandbox)

        executable.runInContext(context, {})

        await sandbox.main().catch((err) => (error = err))

        return {
            result,
            error,
            logs,
        }
    }

    public async evaluate(code: string, scope?: Record<string, any>) {
        try {
            return await this._evaluate(code, scope)
        } catch (error: any) {
            return {
                result: null,
                error: {
                    message: error.message,
                    stack: error.stack,
                },
                logs: [],
            }
        }
    }
}
