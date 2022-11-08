import { test } from '@japa/runner'

import InMemoryApp from '../../__tests__/app'
import CollectionFactory from '../../__tests__/factories/collections'
import UpdateCollection from './update-collection'

test.group('update-collection (use-case)', (group) => {

    const app = new InMemoryApp()

    const useCase = new UpdateCollection(app)

    group.tap(t => t.teardown(() => app.memoryDrive.clear()))

    test('should update a collection in workspace', async ({ expect }) => {
        const collection = CollectionFactory.create()

        app.memoryDrive.createFile('.is/collections.json', JSON.stringify([collection]))

        const workspace = await app.workspaceRepository.createFake()

        await useCase.execute({
            workspaceId: workspace.id,
            collectionId: collection.id,
            data: {
                name: 'update-name'
            }
        })

        const content = app.memoryDrive.content.get('.is/collections.json')

        const json = content ? JSON.parse(content.toString()) : []
        
        expect(json[0].name).toEqual('update-name')

    })
    
    test('should trigger an error if collection was not found', async ({expect}) => {
        expect.assertions(1)

        const workspace = await app.workspaceRepository.createFake()

        await useCase.execute({
            workspaceId: workspace.id,
            collectionId: 'invalid',
            data: {},
        }).catch(err => expect(err.message).toEqual('Collection not found'))
    })

})