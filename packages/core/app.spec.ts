import { test } from '@japa/runner'

import App from './app'
import CrudManager from './gateways/crud-manager'
import DriveManager from './gateways/drive-manager'
import InMemoryCrud from './__tests__/gateways/in-memory-crud'
import InMemoryDrive from './__tests__/gateways/in-memory-drive'
import InMemoryWorkspaceRepository from './__tests__/repositories/in-memory-workspace-repository'

test.group('app', () => {
    test('should instantiate an app', ({ expect }) => {
        const workspaceRepository = new InMemoryWorkspaceRepository()
        const memoryDrive = new InMemoryDrive()
        const memoryCrud = new InMemoryCrud()
        const driveManager = new DriveManager({ memory: memoryDrive }, 'memory')
        const crudManger = new CrudManager({ memory: memoryCrud })

        const app = new App({
            workspaceRepository,
            driveManager,
            crudManger,
        })

        expect(app.managers.drive).toEqual(driveManager)
        expect(app.managers.crud).toEqual(crudManger)
    })
})
