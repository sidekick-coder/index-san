import { test } from '@japa/runner'
import InMemoryAppConfig from '../../__tests__/in-memory-config'
import ShowWorkspaceOptions from './show-workspace-options'

test.group('show-workspace-options (use-case)', () => {
    const app = new InMemoryAppConfig()

    const useCase = new ShowWorkspaceOptions(app)

    test('should return workspace options', async ({ expect }) => {
        const options = {
            theme: {
                accent: '#000',
                lines: '#eee',
            },
        }

        app.drive.createFile('.is/options.json', options)

        const workspace = await app.workspaceRepository.createFake()

        const result = await useCase.execute({ workspaceId: workspace.id })

        expect(result.data).toEqual(options)
    })
})
