import { test } from '@japa/runner'
import InMemoryCrud from '../__tests__/gateways/in-memory-crud'
import CrudManager from './crud-manager'

test.group('crud manager (unit)', () => {
    const crud = new InMemoryCrud()

    test('should instantiate with cruds', ({ expect }) => {
        const cruds = {
            memory: crud,
            memory2: crud,
        }

        const manager = new CrudManager(cruds)

        expect(manager.getCruds()).toEqual(cruds)
    })

    test('should use() method toggle current crud', ({ expect }) => {
        const cruds = {
            memory: crud,
            memory2: crud,
        }

        const manager = new CrudManager(cruds)

        manager.use('memory')

        expect(manager.getCurrent()).toEqual('memory')

        manager.use('memory2')

        expect(manager.getCurrent()).toEqual('memory2')
    })
})
