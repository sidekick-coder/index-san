import EvaluationOutput from '../../entities/evaluation-output'

export default interface IEvaluationService {
    evaluate(code: string, scope?: Record<string, any>): Promise<EvaluationOutput>
}
