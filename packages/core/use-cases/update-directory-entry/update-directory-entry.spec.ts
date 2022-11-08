import { test } from '@japa/runner'

import DirectoryEntry from '../../entities/directory-entry'
import InMemoryApp from '../../__tests__/app'

import UpdateDirectoryEntry from './update-directory-entry'

test.group('update-directory-entry (use-case)', (group) => {
    const app = new InMemoryApp()

    const useCase = new UpdateDirectoryEntry(app)

    group.each.teardown(() => app.clear())

    test('should update an entry using drive', async ({ expect }) => {

        const workspace = await app.workspaceRepository.createFake()

        await app.memoryDrive.write('text.txt', Buffer.from(''))
        
        await useCase.execute({
            workspaceId: workspace.id,
            path: 'text.txt',
            newPath: 'update.txt'
        })

        expect(app.memoryDrive.entries[0].path).toEqual('update.txt')
    })
    
    test('should trigger an error if the entry not exist', async ({ expect }) => {
        expect.assertions(1)

        const workspace = await app.workspaceRepository.createFake()  
        
        const entry = new DirectoryEntry({
            name: 'text.txt',
            path: 'text.txt',
            type: 'file'
        })

        await useCase.execute({
            workspaceId: workspace.id,
            path: entry.path,
            newPath: 'update.txt'
        }).catch(err => expect(err.message).toEqual('DirectoryEntry not exists'))
    })

})