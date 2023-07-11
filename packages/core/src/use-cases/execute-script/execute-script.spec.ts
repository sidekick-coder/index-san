import { test } from '@japa/runner'
import DirectoryEntry from '../../entities/directory-entry'
import Workspace from '../../entities/workspace'

import InMemoryAppConfig from '../../__tests__/in-memory-config'
import ExecuteScript from './execute-script'

test.group('execute-script (use-case)', (group) => {
    const app = new InMemoryAppConfig()
    const useCase = new ExecuteScript(app)

    let workspace: Workspace

    group.each.setup(() => {
        workspace = app.workspaceRepository.createFakeSync()

        return () => app.clear()
    })

    test('should execute script function and return result', async ({ expect }) => {
        const { result } = await useCase.execute({
            workspaceId: workspace.id,
            content: 'setResult("Hello word")',
        })

        expect(result).toBe('Hello word')
    })

    test('should create a file in workspace', async ({ expect }) => {
        await useCase.execute({
            workspaceId: workspace.id,
            content: `await Drive.write("hello.txt", DirectoryEntry.encode("Hello word"))`,
        })

        const content = await app.drive.read('hello.txt')

        expect(content).toBeDefined()

        expect(DirectoryEntry.decode(content!)).toBe('Hello word')
    })
})
