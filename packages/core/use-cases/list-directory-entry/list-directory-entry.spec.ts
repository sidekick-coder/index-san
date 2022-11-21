import { test } from '@japa/runner'
import InMemoryApp from '../../__tests__/app'
import WorkspaceFactory from '../../__tests__/factories/workspace-factory'
import ListDirectoryEntry from './list-directory-entry'

test.group('list-directory-entry (use-case)', (group) => {
    const app = new InMemoryApp()

    const useCase = new ListDirectoryEntry(app)

    group.tap((t) => t.teardown(() => app.memoryDrive.clear()))

    test('should list a directory using workspace', async ({ expect }) => {
        const workspace = await app.workspaceRepository.create(WorkspaceFactory.create())

        app.memoryDrive.createFile('file-01.txt', '')
        app.memoryDrive.createFile('file-02.txt', '')
        app.memoryDrive.createFile('file-03.txt', '')

        const result = await useCase.execute({
            workspaceId: workspace.id,
        })

        expect(result.data.length).toEqual(3)
    })
})
