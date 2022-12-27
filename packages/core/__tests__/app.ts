import CrudManager from '../gateways/crud-manager'
import DriveManager from '../gateways/drive-manager'
import NodeVMEvaluation from '../gateways/evaluation/implementations/node-vm-evaluation'
import AppService, { AppServiceArgs } from '../services/app-service'
import InMemoryCrud from './gateways/in-memory-crud'
import InMemoryDrive from './gateways/in-memory-drive'
import InMemoryWorkspaceRepository from './repositories/in-memory-workspace-repository'

const workspaceRepository = new InMemoryWorkspaceRepository()
const memoryDrive = new InMemoryDrive()
const memoryCrud = new InMemoryCrud()
const driveManager = new DriveManager({ memory: memoryDrive }, 'memory')
const crudManger = new CrudManager({ memory: memoryCrud })
const evaluation = new NodeVMEvaluation()

memoryCrud.drive = memoryDrive

export default class InMemoryApp extends AppService {
    public workspaceRepository = workspaceRepository
    public memoryDrive = memoryDrive
    public memoryCrud = memoryCrud

    constructor(args?: Partial<AppServiceArgs>) {
        super({
            workspaceRepository,
            driveManager,
            crudManger,
            evaluation,
            ...args,
        })
    }

    public clear() {
        this.memoryDrive.clear()
        this.memoryCrud.clear()
        this.workspaceRepository.clear()
    }
}
