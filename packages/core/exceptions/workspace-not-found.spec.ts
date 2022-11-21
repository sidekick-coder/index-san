import { test } from '@japa/runner'

import WorkspaceNotFound from './workspace-not-found'

test.group('workspace not found exception (unit)', () => {
    test('should have format', ({ expect }) => {
        const workspaceId = 'hello'
        const error = new WorkspaceNotFound(workspaceId)

        expect(error.message).toBe('Workspace not found')
        expect(error.i18nKey).toBe('errors.workspaceNotFound')
        expect(error.i18nArgs).toEqual([workspaceId])
    })
})
