import { test } from '@japa/runner'

import CollectionFactory from '../../__tests__/factories/collections'
import WorkspaceFactory from '../../__tests__/factories/workspace-factory'
import InMemoryAppConfig from '../../__tests__/in-memory-config'
import ListCollections from './list-collections'

test.group('list-collections (use-case)', (group) => {
    const app = new InMemoryAppConfig()

    const useCase = new ListCollections(app)

    group.each.teardown(() => app.clear())

    test('should return a list of collections of the workspace', async ({ expect }) => {
        const collections = CollectionFactory.createMany()

        app.drive.createFile('.is/collections.json', collections)

        const workspace = await app.workspaceRepository.create(WorkspaceFactory.create())

        const result = await useCase.execute({
            workspaceId: workspace.id,
        })

        expect(result.data.length).toEqual(collections.length)
    })

    test('should return an empty array if collections.json not exist', async ({ expect }) => {
        const workspace = await app.workspaceRepository.create(WorkspaceFactory.create())

        const result = await useCase.execute({
            workspaceId: workspace.id,
        })

        expect(result.data.length).toEqual(0)
    })
})
