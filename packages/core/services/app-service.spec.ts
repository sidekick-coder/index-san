import { test } from '@japa/runner'
import CrudManager from '../gateways/crud-manager'
import DriveManager from '../gateways/drive-manager'
import InMemoryCrud from '../__tests__/gateways/in-memory-crud'
import InMemoryDrive from '../__tests__/gateways/in-memory-drive'
import InMemoryWorkspaceRepository from '../__tests__/repositories/in-memory-workspace-repository'
import AppService from './app-service'

test.group('app-service (service)', () => {
    const memoryDrive = new InMemoryDrive()
    const memoryCrud = new InMemoryCrud()
    const driveManager = new DriveManager({ memory: memoryDrive })    
    const crudManger = new CrudManager({ memory: memoryCrud  })
    const workspaceRepository = new InMemoryWorkspaceRepository()

    test('should instantiate', async ({ expect }) => {

        const service = new AppService({
            workspaceRepository,
            driveManager,
            crudManger
        })

        expect(service.managers.crud).toEqual(crudManger)
        expect(service.managers.drive).toEqual(driveManager)
        expect(service.repositories.workspace).toEqual(workspaceRepository)
    })

  
})