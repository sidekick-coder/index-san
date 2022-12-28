import Workspace from '@core/entities/workspace'
import WorkspaceNotFound from '@core/exceptions/workspace-not-found'
import IWorkspaceRepository from '@core/repositories/workspace/workspace-repository'
import JSONService from '../services/json-service'

export default class WorkspaceRepository implements IWorkspaceRepository {
    private json: JSONService<Workspace>

    constructor(private readonly filename: string) {
        this.json = new JSONService(filename)
    }

    public async list() {
        await this.json.load()

        return this.json.items
    }

    public async show(id: string): Promise<Workspace> {
        await this.json.load()

        const item = this.json.items.find((i) => i.id === id)

        if (!item) {
            throw new WorkspaceNotFound(id)
        }

        return item
    }

    public async create(workspace: Workspace): Promise<Workspace> {
        await this.json.load()

        this.json.items.push(workspace)

        await this.json.save()

        return workspace
    }

    public async update(id: string, data: Partial<Omit<Workspace, 'id'>>): Promise<void> {
        await this.json.load()

        const workspace = this.json.items.find((i) => i.id === id)
        const index = this.json.items.findIndex((i) => i.id === id)

        if (!workspace) return

        this.json.items[index] = Object.assign(workspace, data, { id })

        await this.json.save()
    }

    public async destroy(id: string): Promise<void> {
        await this.json.load()

        const index = this.json.items.findIndex((i) => i.id === id)

        if (index === -1) return

        this.json.items.splice(index, 1)

        await this.json.save()
    }
}
