import Workspace from '../../entities/workspace'
import WorkspaceNotFound from '../../exceptions/workspace-not-found'
import WorkspaceRepository from '../../repositories/workspace/workspace-repository'
import WorkspaceFactory from '../factories/workspace-factory'

export default class InMemoryWorkspaceRepository implements WorkspaceRepository {
    public items: Workspace[] = []

    public list(): Promise<Workspace[]> {
        return Promise.resolve(this.items)
    }

    public show(id: string): Promise<Workspace> {
        const item = this.items.find((i) => i.id === id)

        if (!item) {
            throw new WorkspaceNotFound(id)
        }

        return Promise.resolve(item)
    }

    public create(workspace: Workspace): Promise<Workspace> {
        this.items.push(workspace)

        return Promise.resolve(workspace)
    }

    public createSync(workspace: Workspace): Workspace {
        this.items.push(workspace)

        return workspace
    }

    public createFake(payload?: Partial<Workspace>): Promise<Workspace> {
        return this.create(WorkspaceFactory.create(payload))
    }

    public createFakeSync(payload?: Partial<Workspace>): Workspace {
        return this.createSync(WorkspaceFactory.create(payload))
    }

    public async update(id: string, data: Partial<Workspace>) {
        const index = this.items.findIndex((w) => w.id === id)

        if (index === -1) return

        this.items[index].name = data.name ?? this.items[index].name
        this.items[index].config = data.config ?? this.items[index].config
    }

    public async destroy(id: string) {
        const index = this.items.findIndex((i) => i.id === id)

        if (index !== -1) {
            this.items.splice(index, 1)
        }
    }

    public clear() {
        this.items = []
    }
}
