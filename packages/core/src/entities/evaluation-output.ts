export default class EvaluationOutput {
    public error: any | null
    public result: any | null
    public logs: string[]

    constructor(props?: Partial<EvaluationOutput>) {
        this.error = props?.error ?? null
        this.result = props?.result ?? null
        this.logs = props?.logs ?? []
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

        return JSON.stringify(arg, null, 4)
    }

    public toObject() {
        return {
            result: this.result,
            logs: this.logs,
            error: this.error
                ? JSON.stringify(this.error, Object.getOwnPropertyNames(this.error))
                : null,
        }
    }
}
