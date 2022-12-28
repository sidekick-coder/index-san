import { test } from '@japa/runner'
import DriveHelper from '../../gateways/drive/helper'

import InMemoryAppConfig from '../../__tests__/in-memory-config'
import UpdateWorkspaceOptions from './update-workspace-options'

test.group('update-workspace-options (use-case)', () => {
    const app = new InMemoryAppConfig()
    const useCase = new UpdateWorkspaceOptions(app)

    test('should update workspace options', async ({ expect }) => {
        const options = {
            hello: 'word',
        }

        app.drive.createFile('.is/options.json', options)

        const workspace = await app.workspaceRepository.createFake()

        await useCase.execute({
            workspaceId: workspace.id,
            data: {
                hello: 'update',
            },
        })

        const contents = await app.drive.read('.is/options.json')

        const result = contents ? DriveHelper.toObject(contents) : {}

        expect(result).toEqual({ hello: 'update' })
    })
})
