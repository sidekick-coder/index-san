import { test } from '@japa/runner'

import InMemoryApp from '../../__tests__/app'

import CreateItem from './create-item'
import CollectionFactory from '../../__tests__/factories/collections'

test.group('create-item (use-case)', group => {

    const app = new InMemoryApp()
    
    const useCase = new CreateItem(app)      
    
    group.each.teardown(() => app.memoryDrive.clear())
    
    test('should create an item in collection', async ({ expect }) => {
        
        const workspace = await app.workspaceRepository.createFake()
        const collection = CollectionFactory.create()

        app.memoryDrive.createFile('.is/collections.json', [collection])
        
        const { data } = await useCase.execute({
            workspaceId: workspace.id,
            collectionId: collection.id,
            data: {}
        })

        expect(app.memoryDrive.entries[1].path).toEqual([collection.path, data.id].join('/'))
    })
})