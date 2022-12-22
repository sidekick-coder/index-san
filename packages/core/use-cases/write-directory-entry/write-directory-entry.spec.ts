import { test } from '@japa/runner'

import InMemoryApp from '../../__tests__/app'
import WriteDirectoryEntry from './write-directory-entry'

test.group('write-directory-entry (use-case', () => {
    const app = new InMemoryApp()
    const useCase = new WriteDirectoryEntry(app)

    test('should update entry with buffer', async ({ expect }) => {
        const workspace = await app.workspaceRepository.createFake()

        await app.memoryDrive.write('test.txt', Buffer.from('Hello word'))

        await useCase.execute({
            workspaceId: workspace.id,
            path: 'test.txt',
            data: Buffer.from('update hello word'),
            contentType: 'Uint8Array',
        })

        const result = await app.memoryDrive.read('test.txt')

        expect(result).toEqual(Buffer.from('update hello word'))
    })

    test('should update entry with string', async ({ expect }) => {
        const workspace = await app.workspaceRepository.createFake()

        await app.memoryDrive.write('test.txt', Buffer.from('Hello word'))

        await useCase.execute({
            workspaceId: workspace.id,
            path: 'test.txt',
            data: 'update hello word',
        })

        const result = await app.memoryDrive.read('test.txt')

        expect(result).toEqual(Buffer.from('update hello word'))
    })
})
