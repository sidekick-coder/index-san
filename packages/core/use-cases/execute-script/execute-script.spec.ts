import { test } from '@japa/runner'
import DirectoryEntry from '../../entities/directory-entry'
import Workspace from '../../entities/workspace'

import InMemoryApp from '../../__tests__/app'
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

    test('should throw an error when trying to use require("fs")', async ({ expect }) => {
        const result = await useCase.execute({
            workspaceId: workspace.id,
            content: 'const fs = require("fs")',
        })

        expect(result.error.message).toBe('require is not defined')
    })

    test('should throw an error when trying to use import fs from "fs"', async ({ expect }) => {
        const result = await useCase.execute({
            workspaceId: workspace.id,
            content: `import fs from "fs"`,
        })

        expect(result.error.message).toBe('exports is not defined')
    })

    test('should create a file in workspace', async ({ expect }) => {
        await useCase.execute({
            workspaceId: workspace.id,
            content: `await Drive.write("hello.txt", Entry.encode("Hello word"))`,
        })

        const content = await app.drive.read('hello.txt')

        expect(content).toBeDefined()

        expect(DirectoryEntry.decode(content!)).toBe('Hello word')
    })
})
