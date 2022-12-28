import EvaluationOutput from '../../../entities/evaluation-output'
import IEvaluationService from '../evaluation'
import escapeRegExp from 'lodash/escapeRegExp'

export default class DefaultEvaluation implements IEvaluationService {
    protected async _evaluate(code: string, scope?: Record<string, any>) {
        const logs: string[] = []
        let result = null
        const error = null

        const sandbox = {
            ...scope,
            setResult: (data: any) => (result = data),
            console: {
                log: (...args: any) => logs.push(args.map(EvaluationOutput.formatLog).join(' ')),
            },
        }

        let fixCode = code

        for (const key in sandbox) {
            fixCode = fixCode
                .replace(new RegExp(escapeRegExp(`${key}.`), 'g'), `context.${key}.`)
                .replace(new RegExp(escapeRegExp(`${key}(`), 'g'), `context.${key}(`)
        }

        const fn = new Function(`
            const context = this

            async function run(){
                ${fixCode}
            }

            return run()
        `)

        await fn.bind(sandbox)()

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
            return EvaluationOutput.error(error)
        }
    }
}
