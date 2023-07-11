import { test } from '@japa/runner'

import DirectoryEntry from '../../entities/directory-entry'
import DirectoryEntryAlreadyExists from '../../exceptions/directory-entry-already-exists'
import InMemoryAppConfig from '../../__tests__/in-memory-config'

import CreateDirectoryEntry from './create-directory-entry'

test.group('create-directory-entry (use-case)', (group) => {
    const app = new InMemoryAppConfig()

    const useCase = new CreateDirectoryEntry(app)

    group.each.teardown(() => app.clear())

    test('should create a new entry using drive', async ({ expect }) => {
        const workspace = await app.workspaceRepository.createFake()

        const entry = new DirectoryEntry({
            name: 'text.txt',
            path: 'text.txt',
            type: 'file',
        })

        await useCase.execute({
            workspaceId: workspace.id,
            data: entry,
        })

        expect(app.drive.entries[0]).toEqual(entry)
    })

    test('should trigger an error if the entry filepath already exist', async ({ expect }) => {
        expect.assertions(1)

        const workspace = await app.workspaceRepository.createFake()

        const entry = DirectoryEntry.file('text.txt')

        app.drive.createFile(entry.path, '')

        await useCase
            .execute({
                workspaceId: workspace.id,
                data: entry,
            })
            .catch((err) => expect(err).toEqual(new DirectoryEntryAlreadyExists(entry.path)))
    })
})
