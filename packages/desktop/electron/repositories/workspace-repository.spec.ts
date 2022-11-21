import path from 'path'
import { describe, afterEach, expect, it } from 'vitest'

import WorkspaceFactory from '../../../core/__tests__/factories/workspace-factory'

import TestFS from '../../__tests__/fixtures/test-fs'
import WorkspaceRepository from './workspace-repository'

const testFS = new TestFS()
const repository = new WorkspaceRepository(path.resolve(testFS.tmpdir, 'workspaces.json'))

describe('workspace-repository.ts', () => {
    afterEach(() => testFS.clear())

    it('should return a list of workspaces', async () => {
        const workspaces = WorkspaceFactory.createMany()

        await testFS.createFile('workspaces.json', JSON.stringify(workspaces))

        const result = await repository.findAll()

        expect(workspaces).toEqual(result)
    })

    it('should return a workspace by id', async () => {
        const workspaces = WorkspaceFactory.createMany()

        await testFS.createFile('workspaces.json', JSON.stringify(workspaces))

        const result = await repository.findById(workspaces[0].id)

        expect(result).toEqual(workspaces[0])
    })

    it('should create a new workspace', async () => {
        const data = WorkspaceFactory.create({ name: 'test' })

        await repository.create(data)

        const workspaces = await repository.findAll()

        expect(workspaces[0]).toEqual(data)
    })

    it('should update a workspace', async () => {
        const workspaces = WorkspaceFactory.createMany()

        await testFS.createFile('workspaces.json', JSON.stringify(workspaces))

        await repository.updateById(workspaces[0].id, {
            name: 'update workspace',
        })

        const workspace = await repository.findById(workspaces[0].id)

        expect(workspace?.name).toEqual('update workspace')
    })

    it('should delete workspace', async () => {
        const workspaces = WorkspaceFactory.createMany()

        await testFS.createFile('workspaces.json', JSON.stringify(workspaces))

        await repository.delete(workspaces[0].id)

        const deleted = await repository.findById(workspaces[0].id)

        expect(deleted).toBeNull()
    })
})
