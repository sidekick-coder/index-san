import Workspace from '@core/entities/workspace'
import WorkspaceNotFound from '@core/exceptions/workspace-not-found'
import IWorkspaceRepository from '@core/repositories/workspace/workspace-repository'
import uniqBy from 'lodash/uniqBy'

import { writeTextFile, readTextFile } from '@tauri-apps/api/fs'
import { join, dataDir } from '@tauri-apps/api/path'

export default class FSWorkspaceRepository implements IWorkspaceRepository {
    public async save(workspaces: Workspace[]) {
        const filename = await join(await dataDir(), 'workspaces.json')

        await writeTextFile(filename, JSON.stringify(uniqBy(workspaces, 'id'), null, 4))
    }

    public async list(): Promise<Workspace[]> {
        const filename = await join(await dataDir(), 'workspaces.json')

        const content = await readTextFile(filename)
            .then((r) => r)
            .catch(() => '[]')

        return JSON.parse(content)
    }

    public async show(id: string): Promise<Workspace> {
        const items = await this.list()

        const item = items.find((i) => i.id === id)

        if (!item) {
            throw new WorkspaceNotFound(id)
        }

        return Promise.resolve(item)
    }

    public async update(id: string, data: Partial<Omit<Workspace, 'id'>>): Promise<void> {
        const workspaces = await this.list()

        const item = workspaces.find((w) => w.id === id)

        if (!item) return

        Object.assign(item, data)

        await this.save(workspaces)
    }

    public async destroy(id: string): Promise<void> {
        const workspaces = await this.list()

        const index = workspaces.findIndex((w) => w.id === id)

        if (index === -1) return

        workspaces.splice(index, 1)

        await this.save(workspaces)
    }

    public async create(payload: Workspace): Promise<Workspace> {
        const workspaces = await this.list()

        workspaces.push(payload)

        await this.save(workspaces)

        return payload
    }
}
