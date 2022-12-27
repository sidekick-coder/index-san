import { test } from '@japa/runner'
import InMemoryApp from '../../__tests__/app'
import WorkspaceFactory from '../../__tests__/factories/workspace-factory'
import CreateWorkspace from './create-workspace'

test.group('create-workspace (use-case)', () => {
    const app = new InMemoryApp()

    const useCase = new CreateWorkspace(app)

    test('should create a workspace', async ({ expect }) => {
        const workspace = app.workspaceRepository.createFakeSync()

        await useCase.execute(workspace)

        const item = app.workspaceRepository.items[0]

        expect(item.name).toEqual(workspace.name)
        expect(item.driveName).toEqual(workspace.driveName)
        expect(item.config).toEqual(workspace.config)
    })

    test('should throw an error if drive is invalid', async ({ expect }) => {
        expect.assertions(1)

        const workspace = WorkspaceFactory.create({
            driveName: 'invalid',
        })

        await useCase
            .execute(workspace)
            .catch((err) => expect(err.message).toEqual('Invalid drive'))
    })
})
