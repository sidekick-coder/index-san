import { test } from '@japa/runner'
import InMemoryApp from '../../__tests__/app'
import ShowWorkspace from './show-workspace'

test.group('show-workspace (use-case)', (group) => {
    const app = new InMemoryApp()

    const useCase = new ShowWorkspace(app)

    group.teardown(() => app.clear())

    test('should return a workspace', async ({ expect }) => {
        const workspace = app.workspaceRepository.createFakeSync()

        const result = await useCase.execute({
            id: workspace.id,
        })

        expect(result).toEqual(workspace)
    })

    test('should throw an error if workspace was not found', async ({ expect }) => {
        expect.assertions(1)

        await useCase.execute({ id: '999' }).catch((err) => {
            expect(err.message).toEqual('Workspace not found')
        })
    })
})
