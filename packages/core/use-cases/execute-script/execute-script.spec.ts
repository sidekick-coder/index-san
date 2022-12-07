import { test } from '@japa/runner'

import InMemoryApp from '../../__tests__/app'
import ExecuteScript from './execute-script'

test.group('execute-script (use-case)', (group) => {
    const app = new InMemoryApp()
    const useCase = new ExecuteScript(app)

    const workspace = app.workspaceRepository.createFakeSync()

    group.each.teardown(() => app.memoryDrive.clear())

    test('should execute script function and return result', async ({ expect }) => {
        const { result } = await useCase.execute({
            workspaceId: workspace.id,
            content: 'return "Hello word"',
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
        app.memoryDrive.createFile('.is/scripts/hello.js', `import fs from "fs"`)

        const result = await useCase.execute({
            workspaceId: workspace.id,
            content: `import fs from "fs"`,
        })

        expect(result.error.message).toBe('Cannot use import statement outside a module')
    })

    test('should create a file in workspace', async ({ expect }) => {
        await useCase.execute({
            workspaceId: workspace.id,
            content: `await workspace.drive.write("hello.txt", "Hello word")`,
        })

        const content = await app.memoryDrive.read('hello.txt')

        expect(content?.toString()).toBe('Hello word')
    })
})
