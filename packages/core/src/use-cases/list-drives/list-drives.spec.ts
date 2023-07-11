import { test } from '@japa/runner'
import InMemoryDrive from '../../__tests__/gateways/in-memory-drive'

import InMemoryAppConfig from '../../__tests__/in-memory-config'
import ListDrives from './list-drives'

import lowerCase from 'lodash/lowerCase'
import upperFirst from 'lodash/upperFirst'

test.group('list-drives (use-case)', (group) => {
    const drives = {
        drive1: new InMemoryDrive(),
        drive2: new InMemoryDrive(),
    }
    const app = new InMemoryAppConfig({
        drives,
    })

    const useCase = new ListDrives(app)

    group.each.teardown(() => app.clear())

    test('should test use-case', async ({ expect }) => {
        const result = await useCase.execute()

        expect(result.data).toEqual(
            Object.keys(drives).map((key) => ({
                id: key,
                label: upperFirst(lowerCase(key)),
            }))
        )
    })
})
