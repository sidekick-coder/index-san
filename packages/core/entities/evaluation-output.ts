export default class EvaluationOutput {
    public error: any | null
    public result: any | null
    public logs: string[]

    constructor(props: EvaluationOutput) {
        this.error = props.error
        this.result = props.result
        this.logs = props.logs
    }

    public static error(error: any, logs: EvaluationOutput['logs'] = []) {
        return new EvaluationOutput({
            error,
            logs,
            result: null,
        })
    }

    public static formatLog(arg: any) {
        if (typeof arg === 'string') {
            return arg
        }

        return JSON.stringify(arg)
    }
}
