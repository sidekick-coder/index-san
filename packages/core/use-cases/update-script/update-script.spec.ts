import { test } from '@japa/runner'
import Workspace from '../../entities/workspace'

import InMemoryApp from '../../__tests__/app'
import UpdateScript from './update-script'

test.group('update-script (use-case)', (group) => {
    const app = new InMemoryApp()
    const useCase = new UpdateScript(app)

    let workspace: Workspace

    group.each.setup(() => {
        workspace = app.workspaceRepository.createFakeSync()

        return () => app.clear()
    })

    test('should throw an error if script not exists ', async ({ expect }) => {
        expect.assertions(1)

        await useCase
            .execute({
                workspaceId: workspace.id,
                name: 'invalid',
                content: 'async main(){ return 2 }',
            })
            .catch((err) => expect(err.message).toBe('Script not found'))
    })

    test('should update a script ', async ({ expect }) => {
        app.memoryDrive.createFile('.is/scripts/hello.js', 'async main(){ return 1 }')

        await useCase.execute({
            workspaceId: workspace.id,
            name: 'hello',
            content: 'async main(){ return 2 }',
        })

        const content = await app.managers.drive.readAsString('.is/scripts/hello.js')

        expect(content?.toString()).toBe('async main(){ return 2 }')
    })
})
