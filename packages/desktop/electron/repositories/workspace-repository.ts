import Workspace from '../../../core/entities/workspace'
import IWorkspaceRepository from '../../../core/repositories/workspace-repository'
import JSONService from '../services/json-service'

export default class WorkspaceRepository implements IWorkspaceRepository {

    private json: JSONService<Workspace>

    constructor(private readonly filename: string){
        this.json = new JSONService(filename)
    }
    
    public async findAll(): Promise<Workspace[]> {
        await this.json.load()

        return this.json.items
    }
    
    public findById(id: string): Promise<Workspace> {
        throw new Error('Not implemented')
    }

    public create(workspace: Workspace): Promise<Workspace> {
        throw new Error('Not implemented')
    }
    
    public updateById(id: string, data: Partial<Omit<Workspace, 'id'>>): Promise<void> {
        throw new Error('Not implemented')
        
    }
    
    public delete(id: string): Promise<void> {
        throw new Error('Not implemented')        
    }

}