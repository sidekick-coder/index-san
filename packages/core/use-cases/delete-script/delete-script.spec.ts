import { test } from '@japa/runner'

import InMemoryApp from '../../__tests__/app'
import DeleteScript from './delete-script'

test.group('delete-script (use-case)', (group) => {

    const app = new InMemoryApp()
    const useCase = new DeleteScript(app)
    const workspace = app.workspaceRepository.createFakeSync()

    group.each.teardown(() => app.memoryDrive.clear())

    test('should throw an error if script not exists', async ({ expect }) => {
        expect.assertions(1)

        await useCase.execute({
            workspaceId: workspace.id,
            name: 'hello'
        }).catch(err => expect(err.message).toBe('Script not found'))
    })
    
    test('should delete script', async ({ expect }) => {

        const name = 'hello'

        app.memoryDrive.createFile(`.is/scripts/${name}.js`, 'async main(){ return 1 }')

        await useCase.execute({
            workspaceId: workspace.id,
            name
        })

        const exists = await app.memoryDrive.exists(`.is/scripts/${name}.js`)

        expect(exists).toBe(false)
    })

})