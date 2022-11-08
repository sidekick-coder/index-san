import { test } from '@japa/runner'

import InMemoryApp from '../../__tests__/app'
import ListImporters from './list-importers'

test.group('list-importers (use-case)', () => {


    const app = new InMemoryApp()

    const useCase = new ListImporters(app)

    test('should list importers', async ({ expect }) => {
        const workspace = await app.workspaceRepository.createFake()

        app.memoryDrive.createFile('.is/importers/importer-01.js', 'export default () => {}')
        app.memoryDrive.createFile('.is/importers/importer-02.js', 'export default () => {}')
        app.memoryDrive.createFile('.is/importers/importer-03.js', 'export default () => {}')

        const result = await useCase.execute({
            workspaceId: workspace.id
        })

        expect(result.data.length).toEqual(3)
    })
})