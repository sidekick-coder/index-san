export interface IEvaluationOutput {
    error: any | null
    result: any | null
    logs: string[]
}

export default interface IEvaluationService {
    evaluate(code: string, scope?: Record<string, any>): Promise<IEvaluationOutput>
}
