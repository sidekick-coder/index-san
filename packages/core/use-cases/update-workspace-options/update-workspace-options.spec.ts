import { test } from '@japa/runner'

import InMemoryApp from '../../__tests__/app'
import UpdateWorkspaceOptions from './update-workspace-options'

test.group('update-workspace-options (use-case)', () => {
    const app = new InMemoryApp()
    const useCase = new UpdateWorkspaceOptions(app)

    test('should update workspace options', async ({ expect }) => {
        const options = {
            hello: 'word',
        }

        app.memoryDrive.createFile('.is/options.json', options)

        const workspace = await app.workspaceRepository.createFake()

        await useCase.execute({
            workspaceId: workspace.id,
            data: {
                hello: 'update',
            },
        })

        const contents = await app.memoryDrive.read('.is/options.json')

        const result = contents ? JSON.parse(contents.toString()) : {}

        expect(result).toEqual({ hello: 'update' })
    })
})
