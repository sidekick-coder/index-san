import { test } from '@japa/runner'

import DirectoryEntry from '../../entities/directory-entry'
import InMemoryApp from '../../__tests__/app'
import WorkspaceFactory from '../../__tests__/factories/workspace-factory'

import DeleteDirectoryEntry from './delete-directory-entry'

test.group('delete-directory-entry (use-case)', () => {

    const app = new InMemoryApp()

    const useCase = new DeleteDirectoryEntry(app)

    test('should delete an entry of drive', async ({ expect }) => {

        const workspace = await app.workspaceRepository.create(WorkspaceFactory.create())        

        const entry = DirectoryEntry.file('text.txt')

        app.memoryDrive.createFile(entry.path, '')
        
        await useCase.execute({
            workspaceId: workspace.id,
            path: entry.path,
        })

        expect(app.memoryDrive.entries.length).toEqual(0)
    })
    
    test('should trigger an error if the entry not exist', async ({ expect }) => {
        expect.assertions(1)

        const workspace = await app.workspaceRepository.create(WorkspaceFactory.create())        
        
        const entry = new DirectoryEntry({
            name: 'text.txt',
            path: 'text.txt',
            type: 'file'
        })

        await useCase.execute({
            workspaceId: workspace.id,
            path: entry.path,
        }).catch(err => expect(err.message).toEqual('DirectoryEntry not exists'))
    })

})