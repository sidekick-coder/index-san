import { test } from '@japa/runner'

import InMemoryApp from '../../__tests__/app'
import CreateScript from './create-script'

test.group('create-script (use-case)', (group) => {

    const app = new InMemoryApp()

    const useCase = new CreateScript(app)

    group.each.teardown(() => app.memoryDrive.clear())

    test('should create a script', async ({ expect }) => {
        const workspace = await app.workspaceRepository.createFake()

        const data = {
            name: 'my-script',
            content: 'export default (workspace) => "Hello word" '
        }

        await useCase.execute({
            workspaceId: workspace.id,
            data
        })

        const content = await app.memoryDrive.read(`.is/scripts/${data.name}.js`)

        expect(content).not.toBeNull()

        expect(content?.toString()).toEqual(data.content)
    })})