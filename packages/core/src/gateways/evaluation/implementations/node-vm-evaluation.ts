import vm from 'vm'

import EvaluationOutput from '../../../entities/evaluation-output'
import type IEvaluationService from '../evaluation'

export default class ScriptService implements IEvaluationService {
    protected async _evaluate(code: string, scope?: Record<string, any>) {
        const logs: string[] = []
        let result = null
        let error = null

        const sandbox = {
            setResult: (data: any) => (result = data),
            console: {
                log: (...args: any) => logs.push(args.map(EvaluationOutput.formatLog).join(' ')),
            },
            ...scope,
            main: (): Promise<any> => Promise.resolve('Error executing script'),
        }

        const executable = new vm.Script(`async function main(){
            
            ${code}

        }`)
        const context = vm.createContext(sandbox)

        executable.runInContext(context, {})

        await sandbox.main().catch((err) => (error = err))

        return new EvaluationOutput({
            result,
            error,
            logs,
        })
    }

    public async evaluate(code: string, scope?: Record<string, any>) {
        try {
            return await this._evaluate(code, scope)
        } catch (error: any) {
            return EvaluationOutput.error(error)
        }
    }
}
