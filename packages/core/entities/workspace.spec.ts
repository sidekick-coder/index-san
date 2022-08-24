import { test } from '@japa/runner'
import Workspace from './workspace'


test.group('workspace entity', (group) => {
    test('should set id when instantiate', async ({ expect }) => {
        const workspace = new Workspace({
            name: 'test',
            path: 'test',
            drive: 'local',
            config: {}
        })

        expect(workspace.id).toBeDefined()
    })

    test('should use defined id', async ({ expect }) => {
        const workspace = new Workspace({
            name: 'test',
            path: 'test',
            drive: 'local',
            config: {}
        }, 'test')

        expect(workspace.id).toBe('test')
    })
})