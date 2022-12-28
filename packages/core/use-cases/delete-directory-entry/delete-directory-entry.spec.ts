import { test } from '@japa/runner'

import DirectoryEntry from '../../entities/directory-entry'
import DirectoryEntryNotFound from '../../exceptions/directory-entry-not-found'
import WorkspaceFactory from '../../__tests__/factories/workspace-factory'
import InMemoryAppConfig from '../../__tests__/in-memory-config'

import DeleteDirectoryEntry from './delete-directory-entry'

test.group('delete-directory-entry (use-case)', (group) => {
    const app = new InMemoryAppConfig()

    const useCase = new DeleteDirectoryEntry(app)

    group.each.teardown(() => app.clear())

    test('should delete an entry of drive', async ({ expect }) => {
        const workspace = await app.workspaceRepository.create(WorkspaceFactory.create())

        const entry = DirectoryEntry.file('text.txt')

        app.drive.createFile(entry.path, '')

        await useCase.execute({
            workspaceId: workspace.id,
            path: entry.path,
        })

        expect(app.drive.entries.length).toEqual(0)
    })

    test('should trigger an error if the entry not exist', async ({ expect }) => {
        expect.assertions(1)

        const workspace = await app.workspaceRepository.create(WorkspaceFactory.create())

        const entry = DirectoryEntry.file('text.txt')

        await useCase
            .execute({
                workspaceId: workspace.id,
                path: entry.path,
            })
            .catch((err) => expect(err).toEqual(new DirectoryEntryNotFound(entry.path)))
    })
})
