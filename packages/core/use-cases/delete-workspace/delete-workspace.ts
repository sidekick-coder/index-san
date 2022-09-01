import IWorkspaceRepository from '../../repositories/workspace-repository'
import DeleteWorkspaceDto from './delete-workspace.dto'

export default class DeleteWorkspace {
    constructor(
        public readonly repository: IWorkspaceRepository
    ){}

    public async execute({ id }: DeleteWorkspaceDto.Input) {
        await this.repository.delete(id)
    }
}