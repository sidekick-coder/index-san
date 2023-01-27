import { test } from '@japa/runner'
import DirectoryEntry from '../../entities/directory-entry'

import InMemoryAppConfig from '../../__tests__/in-memory-config'
import MoveDirectoryEntry from './move-directory-entry'

test.group('move-directory-entry (use-case)', (group) => {
    const app = new InMemoryAppConfig()
    const useCase = new MoveDirectoryEntry(app)

    group.each.teardown(() => app.clear())

    test('should move a file', async ({ expect }) => {
        const workspace = await app.workspaceRepository.createFake()

        app.drive.createFile('text.txt', '# Hello world')

        await useCase.execute({
            workspaceId: workspace.id,
            sourcePath: 'text.txt',
            targetPath: 'text-copy.txt',
        })

        const content = await app.drive.read('text-copy.txt')

        expect(content).toBeDefined()

        expect(DirectoryEntry.decode(content!)).toEqual('# Hello world')

        expect(await app.drive.exists('text.txt')).toEqual(false)
    })

    test('should move a folder', async ({ expect }) => {
        const workspace = await app.workspaceRepository.createFake()

        app.drive.createDir('my-folder')

        await useCase.execute({
            workspaceId: workspace.id,
            sourcePath: 'my-folder',
            targetPath: 'my-folder-copy',
        })

        const entry = await app.drive.get('my-folder-copy')

        expect(entry).toBeDefined()

        expect(entry!.type).toEqual('directory')

        expect(await app.drive.exists('my-folder')).toEqual(false)
    })
})
