import { test } from '@japa/runner'

import InMemoryApp from '../../__tests__/app'
import CollectionFactory from '../../__tests__/factories/collections'
import CreateCollection from './create-collection'

test.group('create-collection (use-case)', (group) => {
    const app = new InMemoryApp()

    const useCase = new CreateCollection(app)

    group.tap((t) => t.teardown(() => app.memoryDrive.clear()))

    test('should create a collection in workspace', async ({ expect }) => {
        const collection = CollectionFactory.create()

        const workspace = await app.workspaceRepository.createFake()

        await useCase.execute({
            workspaceId: workspace.id,
            data: collection,
        })

        const content = await app.memoryDrive.readArray('.is/collections.json')

        expect(content.length).toEqual(1)

        expect(content[0].path).toEqual(collection.path)
    })
})
