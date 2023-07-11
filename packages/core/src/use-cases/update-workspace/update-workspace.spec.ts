import { test } from '@japa/runner'
import InMemoryAppConfig from '../../__tests__/in-memory-config'
import UpdateWorkspace from './update-workspace'

test.group('update-workspace (use-case)', () => {
    const app = new InMemoryAppConfig()

    const useCase = new UpdateWorkspace(app)

    test('should update a workspace', async ({ expect }) => {
        const workspace = app.workspaceRepository.createFakeSync()

        await useCase.execute({
            workspaceId: workspace.id,
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
