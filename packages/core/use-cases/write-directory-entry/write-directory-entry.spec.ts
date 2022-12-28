import { test } from '@japa/runner'
import DriveHelper from '../../gateways/drive/helper'

import InMemoryAppConfig from '../../__tests__/in-memory-config'
import WriteDirectoryEntry from './write-directory-entry'

test.group('write-directory-entry (use-case', (group) => {
    const app = new InMemoryAppConfig()
    const useCase = new WriteDirectoryEntry(app)

    group.each.teardown(() => app.clear())

    test('should write entry file content', async ({ expect }) => {
        const workspace = await app.workspaceRepository.createFake()

        await app.drive.write('test.txt', DriveHelper.encode('Hello word'))

        await useCase.execute({
            workspaceId: workspace.id,
            path: 'test.txt',
            data: DriveHelper.encode('update hello word'),
        })

        const result = await app.drive.read('test.txt')

        expect(DriveHelper.toString(result as Uint8Array)).toEqual('update hello word')
    })
})
