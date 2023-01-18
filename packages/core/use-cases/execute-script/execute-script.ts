import DirectoryEntry from '../../entities/directory-entry'

import type ExecuteScriptDTO from './execute-script.dto'
import type AppConfig from '../../config/app'

import Moment from 'moment'

import EvaluationFacade from '../../facades/script'
export default class ExecuteScript {
    constructor(private readonly app: AppConfig) {}

    public async execute({ workspaceId, content, scope }: ExecuteScriptDTO) {
        const workspace = await this.app.repositories.workspace.show(workspaceId)

        const drive = this.app.facades.drive.fromWorkspace(workspace)

        const createRepository = (name: string) => {
            return this.app.facades.item.createRepositoryFromWorkspace(workspace, name)
        }

        const sandbox: any = {
            ...scope,
            scope,
            Workspace: workspace,
            Drive: drive,
            Moment,
            DirectoryEntry,
            createRepository,
            Facades: this.app.facades,

            // libs
            fetch: this.app.services.fetch.provide(),
        }

        const evaluation = new EvaluationFacade(drive, this.app.services.evaluation, sandbox)

        sandbox.Evaluation = evaluation

        return this.app.services.evaluation.evaluate(content, sandbox)
    }
}
