import { test } from '@japa/runner'
import DirectoryEntry from '../../entities/directory-entry'
import InMemoryApp from '../../__tests__/app'
import WorkspaceFactory from '../../__tests__/factories/workspace-factory'

import CreateDirectoryEntry from './create-directory-entry'

test.group('create-directory-entry (use-case)', (group) => {

    const app = new InMemoryApp()

    const useCase = new CreateDirectoryEntry(app)

    group.each.teardown(() => app.memoryDrive.clear())

    test('should create a new entry using drive', async ({ expect }) => {

        const workspace = await app.repositories.workspace.create(WorkspaceFactory.create())        

        const entry = new DirectoryEntry({
            name: 'text.txt',
            path: 'text.txt',
            type: 'file'
        })
        
        await useCase.execute({
            workspaceId: workspace.id,
            data: entry
        })

        expect(app.memoryDrive.entries[0]).toEqual(entry)
    })
    
    test('should trigger an error if the entry filepath already exist', async ({ expect }) => {
        expect.assertions(1)

        const workspace = await app.repositories.workspace.create(WorkspaceFactory.create())      
        
        const entry = DirectoryEntry.file('text.txt')

        app.memoryDrive.createFile(entry.path, '')

        await useCase.execute({
            workspaceId: workspace.id,
            data: entry
        }).catch(err => expect(err.message).toEqual('DirectoryEntry already exists'))
    })

})