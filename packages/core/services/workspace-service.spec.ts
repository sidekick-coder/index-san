import { test } from '@japa/runner'


import InMemoryApp from '../__tests__/app'
import CollectionFactory from '../__tests__/factories/collections'
import CollectionService from './collection-service'
import WorkspaceService from './workspace-service'

test.group('workspace-service (service)', (group) => {

    
    const app = new InMemoryApp()
    const workspace = app.workspaceRepository.createFakeSync()

    group.each.teardown(() => app.memoryDrive.clear())

    test('should throw an error if a workspace not exists', async ({ expect }) => {
        expect.assertions(1)

        await WorkspaceService.from(app, 'invalid')
            .catch(err => expect(err.message).toEqual('Workspace not found'))
    })
    
    test('should return a workspace', async ({ expect }) => {
        const service = await WorkspaceService.from(app, workspace.id)

        expect(service).toBeDefined()

        expect(service.id).toBe(workspace.id)
        expect(service.config).toBe(workspace.config)
    })

    
    test('should toObject() return object keys', async ({expect }) => {
        const service = await WorkspaceService.from(app, workspace.id)

        expect(Object.keys(service.toObject()).sort()).toEqual(Object.keys(workspace).sort())
    })
    
    test('should save() update workspace', async ({expect }) => {
        let service = await WorkspaceService.from(app, workspace.id)

        service.name = 'update workspace'

        await service.save()

        service = await WorkspaceService.from(app, workspace.id)

        expect(service.name).toBe('update workspace')
    })
    
    test('should createCollection() create a collection & return collection service', async ({expect }) => {
        const service = await WorkspaceService.from(app, workspace.id)

        const data = CollectionFactory.create()

        const collection = await service.createCollection(data)

        const json = await app.memoryDrive.readArray('.is/collections.json')

        expect(json.find(c => c.id === data.id)).toBeDefined()

        expect(collection).toBeInstanceOf(CollectionService)
    })

    test('should collection() return an collection service instance', async ({ expect }) => {
        const collection = CollectionFactory.create()

        app.memoryDrive.createFile('.is/collections.json', [collection])

        const service = await WorkspaceService.from(app, workspace.id)
        
        const result = await service.collection(collection.id)

        expect(result).toBeInstanceOf(CollectionService)

        expect(result.id).toBe(collection.id)
    })

  
})