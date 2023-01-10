import { test } from '@japa/runner'

import CollectionFactory from '../../__tests__/factories/collections'
import InMemoryAppConfig from '../../__tests__/in-memory-config'
import CreateCollection from './create-collection'

test.group('create-collection (use-case)', (group) => {
    const app = new InMemoryAppConfig()

    const useCase = new CreateCollection(app)

    group.each.teardown(() => app.clear())

    test('should create a collection in workspace', async ({ expect }) => {
        const collection = CollectionFactory.create()

        const workspace = await app.workspaceRepository.createFake()

        await useCase.execute({
            workspaceId: workspace.id,
            data: collection,
        })

        const content = await app.drive.readArray('.is/collections.json')

        expect(content.length).toEqual(1)

        expect(content[0].path).toEqual(collection.path)
    })
})
