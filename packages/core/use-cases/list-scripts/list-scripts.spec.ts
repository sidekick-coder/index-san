import { test } from '@japa/runner'

import InMemoryApp from '../../__tests__/app'
import ListScripts from './list-scripts'

test.group('list-scripts (use-case)', () => {

    const app = new InMemoryApp()

    const useCase = new ListScripts(app)

    test('should list scripts files', async ({ expect }) => {
        const workspace = await app.workspaceRepository.createFake()

        const length = 3
        const names: string[] = []

        for (let i = 0; i < length; i++) {
            names.push(`importer-${i}`)
            app.memoryDrive.createFile(`.is/scripts/importer-${i}.js`, 'export default () => {}')
        }

        const result = await useCase.execute({
            workspaceId: workspace.id
        })


        expect(result.data.map(s => s.name)).toEqual(names)
    })
})