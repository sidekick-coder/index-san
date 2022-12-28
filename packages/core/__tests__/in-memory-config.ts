import AppConfig from '../config/app'
import InMemoryDrive from './gateways/in-memory-drive'
import InMemoryWorkspaceRepository from './repositories/in-memory-workspace-repository'

export default class InMemoryAppConfig extends AppConfig {
    public workspaceRepository: InMemoryWorkspaceRepository
    public drive: InMemoryDrive

    constructor(args?: Partial<AppConfig>) {
        const workspaceRepository = new InMemoryWorkspaceRepository()
        const drive = new InMemoryDrive()

        const drives: AppConfig['drives'] = {
            memory: drive,
        }

        const repositories: AppConfig['repositories'] = {
            workspace: workspaceRepository,
        }

        super({ repositories, drives, ...args })

        this.workspaceRepository = workspaceRepository
        this.drive = drive
    }

    public clear() {
        this.drive.clear()
        this.workspaceRepository.clear()
    }
}
