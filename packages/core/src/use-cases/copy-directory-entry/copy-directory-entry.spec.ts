import { test } from '@japa/runner'
import DirectoryEntry from '../../entities/directory-entry'

import InMemoryAppConfig from '../../__tests__/in-memory-config'
import CopyDirectoryEntry from './copy-directory-entry'

test.group('copy-directory-entry (use-case)', (group) => {
    const app = new InMemoryAppConfig()
    const useCase = new CopyDirectoryEntry(app)

    group.each.teardown(() => app.clear())

    test('should copy an entry file', async ({ expect }) => {
        const workspace = await app.workspaceRepository.createFake()

        app.drive.createFile('text.txt', '# hello world')

        await useCase.execute({
            workspaceId: workspace.id,
            sourcePath: 'text.txt',
            targetPath: 'text-copy.txt',
        })

        const content = await app.drive.read('text-copy.txt')

        expect(content).toBeDefined()

        expect(DirectoryEntry.decode(content!)).toEqual('# hello world')
    })

    test('should copy an entry folder', async ({ expect }) => {
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
    })
})
