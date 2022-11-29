import { test } from '@japa/runner'

import InMemoryApp from '../../__tests__/app'
import ExecuteScript from './execute-script'

test.group('execute-script (use-case)', (group) => {
    const app = new InMemoryApp()
    const useCase = new ExecuteScript(app)

    const workspace = app.workspaceRepository.createFakeSync()

    group.each.teardown(() => app.memoryDrive.clear())

    test('should throw error when script not exists', async ({ expect }) => {
        expect.assertions(1)

        await useCase
            .execute({
                workspaceId: workspace.id,
                name: 'invalid',
            })
            .catch((err) => expect(err.message).toBe('Script not found'))
    })

    test('should execute script function and return result', async ({ expect }) => {
        app.memoryDrive.createFile('.is/scripts/hello.js', 'return "Hello word"')

        const { result } = await await useCase.execute({
            workspaceId: workspace.id,
            name: 'hello',
        })

        expect(result).toBe('Hello word')
    })

    test('should throw an error when trying to use require("fs")', async ({ expect }) => {
        app.memoryDrive.createFile('.is/scripts/hello.js', `const fs = require('fs')`)

        const result = await useCase.execute({
            workspaceId: workspace.id,
            name: 'hello',
        })

        expect(result.error.message).toBe('require is not defined')
    })

    test('should throw an error when trying to use import fs from "fs"', async ({ expect }) => {
        app.memoryDrive.createFile('.is/scripts/hello.js', `import fs from "fs"`)

        const result = await useCase.execute({
            workspaceId: workspace.id,
            name: 'hello',
        })

        expect(result.error.message).toBe('Cannot use import statement outside a module')
    })

    test('should create a file in workspace', async ({ expect }) => {
        app.memoryDrive.createFile(
            '.is/scripts/hello.js',
            `await workspace.drive.write("hello.txt", "Hello word")`
        )

        await useCase.execute({
            workspaceId: workspace.id,
            name: 'hello',
        })

        const content = await app.memoryDrive.read('hello.txt')

        expect(content?.toString()).toBe('Hello word')
    })
})
