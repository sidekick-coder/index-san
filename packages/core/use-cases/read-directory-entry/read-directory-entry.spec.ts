import { test } from '@japa/runner'
import DriveHelper from '../../gateways/drive/helper'

import InMemoryAppConfig from '../../__tests__/in-memory-config'
import ReadDirectoryEntry from './read-directory-entry'

test.group('read-directory-entry (use-case', (group) => {
    const app = new InMemoryAppConfig()

    const useCase = new ReadDirectoryEntry(app)

    group.each.teardown(() => app.clear())

    test('should return content buffer', async ({ expect }) => {
        const workspace = await app.workspaceRepository.createFake()

        const content = DriveHelper.encode('Hello word')

        await app.drive.write('test.txt', content)

        const result = await useCase.execute({
            workspaceId: workspace.id,
            path: 'test.txt',
        })

        expect(DriveHelper.toString(result as Uint8Array)).toEqual('Hello word')
    })
})
