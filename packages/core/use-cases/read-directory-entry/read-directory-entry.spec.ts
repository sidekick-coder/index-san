import { test } from '@japa/runner'

import InMemoryApp from '../../__tests__/app'
import ReadDirectoryEntry from './read-directory-entry'

test.group('read-directory-entry (use-case', () => {
    const app = new InMemoryApp()

    const useCase = new ReadDirectoryEntry(app)

    test('should return content buffer', async ({ expect }) => {
        const workspace = await app.workspaceRepository.createFake()

        const content = Buffer.from('Hello word')

        await app.memoryDrive.write('test.txt', content)

        const result = await useCase.execute({
            workspaceId: workspace.id,
            path: 'test.txt',
        })

        expect(result).toEqual(content)
    })
})
