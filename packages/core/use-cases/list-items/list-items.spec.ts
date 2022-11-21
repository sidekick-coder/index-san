import { test } from '@japa/runner'
import CrudManager from '../../gateways/crud-manager'
import DriveManager from '../../gateways/drive-manager'
import AppService from '../../services/app-service'
import CollectionFactory from '../../__tests__/factories/collections'
import WorkspaceFactory from '../../__tests__/factories/workspace-factory'
import InMemoryCrud from '../../__tests__/gateways/in-memory-crud'
import InMemoryDrive from '../../__tests__/gateways/in-memory-drive'
import InMemoryWorkspaceRepository from '../../__tests__/repositories/in-memory-workspace-repository'
import ListItems from './list-items'

test.group('list-items (use-case)', (group) => {
    const memoryDrive = new InMemoryDrive()
    const memoryCrud = new InMemoryCrud()
    const driveManager = new DriveManager({ memory: memoryDrive })
    const crudManger = new CrudManager({ memory: memoryCrud })
    const workspaceRepository = new InMemoryWorkspaceRepository()

    const appService = new AppService({
        workspaceRepository,
        driveManager,
        crudManger,
    })

    const useCase = new ListItems(appService)

    const workspace = WorkspaceFactory.create({ drive: 'memory' })
    const collection = CollectionFactory.create({ crudName: 'memory' })

    group.each.setup(() => {
        memoryDrive.write('.is/collections.json', Buffer.from(JSON.stringify([collection])))
        workspaceRepository.createSync(workspace)
    })

    group.each.teardown(() => memoryDrive.clear())

    test('should return a list of items', async ({ expect }) => {
        for (let i = 0; i < 20; i++) {
            memoryDrive.mkdir(`${collection.path}/${i}`)
        }

        const result = await useCase.execute({
            workspaceId: workspace.id,
            collectionId: collection.id,
        })

        expect(result.data.length).toEqual(20)
    })
})
