import Workspace from "../../entities/workspace";
import WorkspaceRepository from "../../repositories/workspace-repository";

export default class InMemoryWorkspaceRepository implements WorkspaceRepository {
    public items: Workspace[] = []

    public findAll(): Promise<Workspace[]> {
        return Promise.resolve(this.items)
    }

    public findById(id: string): Promise<Workspace | null> {
        const item = this.items.find(i => i.id === id)

        return Promise.resolve(item ?? null)
    }

    public create(workspace: Workspace): Promise<Workspace> {
        
        this.items.push(workspace)

        return Promise.resolve(workspace)
    }
    
    public createSync(workspace: Workspace): Workspace {
        
        this.items.push(workspace)

        return workspace
    }

    public async updateById(id: string, data: Partial<Workspace>){
        const index = this.items.findIndex(w => w.id === id)

        if (index === -1) return


        this.items[index].name = data.name ?? this.items[index].name
        this.items[index].config = data.config ?? this.items[index].config
    }

    public async delete(id: string) {
        const index = this.items.findIndex(i => i.id === id)

        if (index !== -1) {
            this.items.splice(index, 1)
        }
    }

    public clear(){
        this.items = []
    }
}