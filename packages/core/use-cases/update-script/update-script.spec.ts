import { test } from '@japa/runner'

import InMemoryApp from '../../__tests__/app'
import UpdateScript from './update-script'

test.group('update-script (use-case)', (group) => {
    const app = new InMemoryApp()
    const useCase = new UpdateScript(app)

    const workspace = app.workspaceRepository.createFakeSync()

    group.each.teardown(() => app.memoryDrive.clear())

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

        const content = await app.memoryDrive.read('.is/scripts/hello.js')

        expect(content?.toString()).toBe('async main(){ return 2 }')
    })
})
