import CrudManager from '../gateways/crud-manager'
import DriveManager from '../gateways/drive/manager'
import NodeVMEvaluation from '../gateways/evaluation/implementations/node-vm-evaluation'
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
        const driveManager = new DriveManager({ memory: memoryDrive }, 'memory')
        const crudManger = new CrudManager({ memory: memoryCrud })
        const evaluation = new NodeVMEvaluation()

        memoryCrud.drive = memoryDrive

        super({
            workspaceRepository,
            driveManager,
            crudManger,
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
