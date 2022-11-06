import Workspace from '../entities/workspace'
import AppService from './app-service'

export default class WorkspaceService extends Workspace {
    
    public appService: AppService

    public get workspaceDrive(){
        this.appService.managers.drive.use(this.drive).config(this.config)

        return this.appService.managers.drive
    }

    private constructor(workspace: Workspace, appService: AppService) {
        super(workspace, workspace.id)

        this.appService = appService
    }

    public static async from(service: AppService, id: string){
        const workspace = await service.repositories.workspace.findById(id)

        if (!workspace) {
            throw new Error('Workspace not found')
        }

        return new WorkspaceService(workspace, service)
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