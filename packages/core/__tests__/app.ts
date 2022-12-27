import CrudManager from '../gateways/crud-manager'
import DriveManager from '../gateways/drive/manager'
import NodeVMEvaluation from '../gateways/evaluation/implementations/node-vm-evaluation'
import CollectionRepository from '../repositories/collection/implementations/collection-repository'
import AppService, { AppServiceArgs } from '../services/app-service'
import InMemoryCrud from './gateways/in-memory-crud'
import InMemoryDrive from './gateways/in-memory-drive'
import InMemoryWorkspaceRepository from './repositories/in-memory-workspace-repository'

export default class InMemoryApp extends AppService {
    public workspaceRepository: InMemoryWorkspaceRepository
    public memoryDrive: InMemoryDrive
    public memoryCrud: InMemoryCrud

    constructor(args?: Partial<AppServiceArgs>) {
        const workspaceRepository = new InMemoryWorkspaceRepository()
        const memoryDrive = new InMemoryDrive()
        const memoryCrud = new InMemoryCrud()
        const evaluation = new NodeVMEvaluation()

        memoryCrud.drive = memoryDrive

        const managers: AppServiceArgs['managers'] = {
            crud: new CrudManager({ memory: memoryCrud }),
            drive: new DriveManager({ memory: memoryDrive }, 'memory'),
        }

        const repositories: AppServiceArgs['repositories'] = {
            workspace: workspaceRepository,
            collection: new CollectionRepository(managers.drive),
        }

        super({
            repositories,
            managers,
            evaluation,
            ...args,
        })

        this.workspaceRepository = workspaceRepository
        this.memoryCrud = memoryCrud
        this.memoryDrive = memoryDrive
    }

    public clear() {
        this.memoryDrive.clear()
        this.memoryCrud.clear()
        this.workspaceRepository.clear()
    }
}
