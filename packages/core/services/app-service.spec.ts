import { test } from '@japa/runner'
import CrudManager from '../gateways/crud-manager'
import DriveManager from '../gateways/drive/manager'
import NodeVMEvaluation from '../gateways/evaluation/implementations/node-vm-evaluation'
import CollectionRepository from '../repositories/collection/implementations/collection-repository'
import InMemoryCrud from '../__tests__/gateways/in-memory-crud'
import InMemoryDrive from '../__tests__/gateways/in-memory-drive'
import InMemoryWorkspaceRepository from '../__tests__/repositories/in-memory-workspace-repository'
import AppService, { AppServiceArgs } from './app-service'

test.group('app-service (service)', () => {
    test('should instantiate', async ({ expect }) => {
        const evaluation = new NodeVMEvaluation()

        const managers: AppServiceArgs['managers'] = {
            crud: new CrudManager({ memory: new InMemoryCrud() }),
            drive: new DriveManager({ memory: new InMemoryDrive() }, 'memory'),
        }

        const repositories: AppServiceArgs['repositories'] = {
            workspace: new InMemoryWorkspaceRepository(),
            collection: new CollectionRepository(managers.drive),
        }

        const service = new AppService({
            repositories,
            managers,
            evaluation,
        })

        expect(service.managers).toEqual(managers)
        expect(service.repositories).toEqual(repositories)
        expect(service.evaluation).toEqual(evaluation)
    })
})
