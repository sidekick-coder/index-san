import DirectoryEntry from '../entities/directory-entry'
import EvaluationOutput from '../entities/evaluation-output'
import DirectoryEntryNotFound from '../exceptions/directory-entry-not-found'
import Drive from '../gateways/drive/drive'
import IEvaluationService from '../gateways/evaluation/evaluation'

export default class EvaluationFacade {
    constructor(
        private readonly drive: Drive,
        private readonly evaluation: IEvaluationService,
        private globalScope: Record<string, any> = {}
    ) {}

    public async fromFile(path: string, scope?: any) {
        const bytes = await this.drive.read(path)

        if (!bytes) {
            return new EvaluationOutput({
                error: new DirectoryEntryNotFound(path),
            })
        }

        const content = DirectoryEntry.decode(bytes)

        return this.evaluation
            .evaluate(content, {
                ...this.globalScope,
                scope,
            })
            .then((r) => new EvaluationOutput(r).toObject())
            .catch((error) => new EvaluationOutput({ error: error.message }))
    }
}
