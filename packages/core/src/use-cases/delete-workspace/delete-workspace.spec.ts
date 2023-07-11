import { test } from '@japa/runner'
import InMemoryAppConfig from '../../__tests__/in-memory-config'
import DeleteWorkspace from './delete-workspace'

test.group('delete-workspace (use-case)', (group) => {
    const app = new InMemoryAppConfig()

    const useCase = new DeleteWorkspace(app)

    group.each.teardown(() => app.clear())

    test('should delete workspace', async ({ expect }) => {
        const workspace = app.workspaceRepository.createFakeSync()

        await useCase.execute({ workspaceId: workspace.id })

        expect(app.workspaceRepository.items.length).toEqual(0)
    })
})
