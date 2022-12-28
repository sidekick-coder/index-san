import { test } from '@japa/runner'

import DirectoryEntry from '../../entities/directory-entry'
import DirectoryEntryNotFound from '../../exceptions/directory-entry-not-found'
import InMemoryAppConfig from '../../__tests__/in-memory-config'

import UpdateDirectoryEntry from './update-directory-entry'

test.group('update-directory-entry (use-case)', (group) => {
    const app = new InMemoryAppConfig()

    const useCase = new UpdateDirectoryEntry(app)

    group.each.teardown(() => app.clear())

    test('should update an entry using drive', async ({ expect }) => {
        const workspace = await app.workspaceRepository.createFake()

        await app.drive.write('text.txt', Buffer.from(''))

        await useCase.execute({
            workspaceId: workspace.id,
            path: 'text.txt',
            newPath: 'update.txt',
        })

        expect(app.drive.entries[0].path).toEqual('update.txt')
    })

    test('should trigger an error if the entry not exist', async ({ expect }) => {
        expect.assertions(1)

        const workspace = await app.workspaceRepository.createFake()

        const entry = DirectoryEntry.file('text.txt')

        await useCase
            .execute({
                workspaceId: workspace.id,
                path: entry.path,
                newPath: 'update.txt',
            })
            .catch((err) => expect(err).toBeInstanceOf(DirectoryEntryNotFound))
    })
})
