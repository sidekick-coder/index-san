import fs from 'fs'
import path from 'path'
import uniqBy from 'lodash/uniqBy'
import { app } from 'electron'

import WorkspaceNotFound from '@index-san/core/exceptions/base'
import { isJSON } from '@index-san/core/services/utils'

import type Workspace from '@index-san/core/entities/workspace'
import type IWorkspaceRepository from '@index-san/core/repositories/workspace/workspace-repository'

export default class WorkspaceRepository implements IWorkspaceRepository {
    public async save(workspaces: Workspace[]) {
        const filename = path.resolve(app.getPath('userData'), 'workspaces.json')

        await fs.promises.writeFile(filename, JSON.stringify(uniqBy(workspaces, 'id'), null, 4))
    }

    public async list(): Promise<Workspace[]> {
        const filename = path.resolve(app.getPath('userData'), 'workspaces.json')

        const content = await fs.promises
            .readFile(filename, { encoding: 'utf-8' })
            .then((r) => r)
            .catch(() => '[]')

        if (isJSON(content)) {
            return JSON.parse(content)
        }

        return []
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
