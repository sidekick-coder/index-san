import Workspace from '../entities/workspace'
import DriveManger from '../gateways/drive-manager'
import AppService from './app-service'

export default class WorkspaceService extends Workspace {
    
    public driveManager: DriveManger

    public get workspaceDrive(){
        this.driveManager.use(this.drive).config(this.config)

        return this.driveManager
    }

    private constructor(workspace: Workspace, driveManager: DriveManger) {
        super(workspace, workspace.id)

        this.driveManager = driveManager
    }

    public static async from(service: AppService, id: string){
        const workspace = await service.repositories.workspace.findById(id)

        if (!workspace) {
            throw new Error('Workspace not found')
        }

        return new WorkspaceService(workspace, service.managers.drive)
    }

    public list(path: string) {
        const entries = this.workspaceDrive.list(path)

        return entries
    }
    
    public async get(path: string) {
        return this.workspaceDrive.get(path)
    }

    public async read(path: string) {
        return this.workspaceDrive.read(path)
    }
    public async write(path: string, content: String | Buffer) {
        if (typeof content === 'string') {
            content = Buffer.from(content)
        }

        await this.workspaceDrive.write(path, content as Buffer)
    }
    
}