import IWorkspacesRepository from 'Repositories/IWorkspacesRepository'

export default class DeleteWorkspace {
  constructor(private workspaceRepository: IWorkspacesRepository) {}

  public async execute(id: string) {
    await this.workspaceRepository.destroy(id)
  }
}
