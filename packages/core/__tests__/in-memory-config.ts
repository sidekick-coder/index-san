import AppConfig from '../config/app'
import InMemoryDrive from './gateways/in-memory-drive'
import InMemoryWorkspaceRepository from './repositories/in-memory-workspace-repository'
import NodeVmEvaluation from '../gateways/evaluation/implementations/node-vm-evaluation'

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

        const services: AppConfig['services'] = {
            evaluation: new NodeVmEvaluation(),
        }

        super({ repositories, drives, services, ...args })

        this.workspaceRepository = workspaceRepository
        this.drive = drive
    }

    public clear() {
        this.drive.clear()
        this.workspaceRepository.clear()
    }
}
