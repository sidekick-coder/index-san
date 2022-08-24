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