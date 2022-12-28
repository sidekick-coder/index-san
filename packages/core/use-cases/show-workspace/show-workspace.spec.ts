import { test } from '@japa/runner'
import WorkspaceNotFound from '../../exceptions/workspace-not-found'
import InMemoryAppConfig from '../../__tests__/in-memory-config'
import ShowWorkspace from './show-workspace'

test.group('show-workspace (use-case)', (group) => {
    const app = new InMemoryAppConfig()

    const useCase = new ShowWorkspace(app)

    group.teardown(() => app.clear())

    test('should return a workspace', async ({ expect }) => {
        const workspace = app.workspaceRepository.createFakeSync()

        const result = await useCase.execute({
            workspaceId: workspace.id,
        })

        expect(result).toEqual(workspace)
    })

    test('should throw an error if workspace was not found', async ({ expect }) => {
        expect.assertions(1)

        await useCase.execute({ workspaceId: '999' }).catch((err) => {
            expect(err).toBeInstanceOf(WorkspaceNotFound)
        })
    })
})
