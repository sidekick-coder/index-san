import { test } from '@japa/runner'
import InMemoryApp from '../../__tests__/app'
import WorkspaceFactory from '../../__tests__/factories/workspace-factory'
import CreateImporter from './create-importer'

test.group('create-importer (use-case)', () => {

    const app = new InMemoryApp()

    const useCase = new CreateImporter(app)

    test('should create a importer', async ({ expect }) => {
        const workspace = await app.repositories.workspace.create(WorkspaceFactory.create({
            drive: 'memory'
        }))

        await useCase.execute({
            workspaceId: workspace.id,
            data: {
                id: 'my-importer',
                content: 'export default (helloWord) => helloWord'
            }
        })

        const content = await app.memoryDrive.read('.is/importers/my-importer.js')

        expect(content).not.toBeNull()

        expect(content?.toString()).toEqual('export default (helloWord) => helloWord')
    })})