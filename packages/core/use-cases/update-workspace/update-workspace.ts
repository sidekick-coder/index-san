import IWorkspaceRepository from '../../repositories/workspace-repository'
import UpdateWorkspaceDTO from './update-workspace.dto'

export default class UpdateWorkspace {
    constructor(public readonly repository: IWorkspaceRepository){}

    public async execute({ id, data }: UpdateWorkspaceDTO.Input){

        const workspace = await this.repository.findById(id)

        if (!workspace) throw new Error('Workspace not found')

        await this.repository.updateById(id, data)

    }
}