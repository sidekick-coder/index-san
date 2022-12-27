import { test } from '@japa/runner'

import App from './app'
import CrudManager from './gateways/crud-manager'
import DriveManager from './gateways/drive/manager'
import NodeVMEvaluation from './gateways/evaluation/implementations/node-vm-evaluation'
import CollectionRepository from './repositories/collection/implementations/collection-repository'
import { AppServiceArgs } from './services/app-service'
import InMemoryCrud from './__tests__/gateways/in-memory-crud'
import InMemoryDrive from './__tests__/gateways/in-memory-drive'
import InMemoryWorkspaceRepository from './__tests__/repositories/in-memory-workspace-repository'

test.group('app', () => {
    test('should instantiate an app', ({ expect }) => {
        const evaluation = new NodeVMEvaluation()

        const managers: AppServiceArgs['managers'] = {
            crud: new CrudManager({ memory: new InMemoryCrud() }),
            drive: new DriveManager({ memory: new InMemoryDrive() }, 'memory'),
        }

        const repositories: AppServiceArgs['repositories'] = {
            workspace: new InMemoryWorkspaceRepository(),
            collection: new CollectionRepository(managers.drive),
        }

        const app = new App({
            repositories,
            managers,
            evaluation,
        })

        expect(app.managers).toEqual(managers)
        expect(app.repositories).toEqual(repositories)
        expect(app.evaluation).toEqual(evaluation)
    })
})
