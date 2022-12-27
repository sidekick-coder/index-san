import { test } from '@japa/runner'
import InMemoryApp from '../../__tests__/app'
import UpdateWorkspace from './update-workspace'

test.group('update-workspace (use-case)', () => {
    const app = new InMemoryApp()

    const useCase = new UpdateWorkspace(app)

    test('should update a workspace', async ({ expect }) => {
        const workspace = app.workspaceRepository.createFakeSync()

        await useCase.execute({
            id: workspace.id,
            data: {
                name: 'update-workspace',
                config: {
                    app_key: '123',
                },
            },
        })

        const updated = await app.workspaceRepository.show(workspace.id)

        expect(updated?.name).toEqual('update-workspace')
        expect(updated?.config).toEqual({
            app_key: '123',
        })
    })
})
