import { test } from '@japa/runner'
import InMemoryApp from '../../__tests__/app'
import DeleteWorkspace from './delete-workspace'

test.group('delete-workspace (use-case)', (group) => {
    const app = new InMemoryApp()

    const useCase = new DeleteWorkspace(app)

    group.each.teardown(() => app.clear())

    test('should delete workspace', async ({ expect }) => {
        const workspace = app.workspaceRepository.createFakeSync()

        await useCase.execute({ id: workspace.id })

        expect(app.workspaceRepository.items.length).toEqual(0)
    })
})
