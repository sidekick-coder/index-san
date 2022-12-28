import { test } from '@japa/runner'
import DriveInvalid from '../../exceptions/drive-invalid'
import WorkspaceFactory from '../../__tests__/factories/workspace-factory'
import InMemoryAppConfig from '../../__tests__/in-memory-config'
import CreateWorkspace from './create-workspace'

test.group('create-workspace (use-case)', (group) => {
    const app = new InMemoryAppConfig()

    const useCase = new CreateWorkspace(app)

    group.each.teardown(() => app.clear())

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

        await useCase.execute(workspace).catch((err) => expect(err).toBeInstanceOf(DriveInvalid))
    })
})
