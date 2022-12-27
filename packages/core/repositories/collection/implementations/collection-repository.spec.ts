import { test } from '@japa/runner'
import Collection from '../../../entities/collection'
import CollectionNotFound from '../../../exceptions/collection-not-found'
import DriveManager from '../../../gateways/drive/manager'
import CollectionFactory from '../../../__tests__/factories/collections'
import InMemoryDrive from '../../../__tests__/gateways/in-memory-drive'
import CollectionRepository from './collection-repository'

test.group('collection-repository (unit)', (group) => {
    const memory = new InMemoryDrive()

    const manager = new DriveManager({ memory }, 'memory')

    const repository = new CollectionRepository(manager)

    group.each.teardown(() => memory.clear())

    function saveCollections(payload: Collection[]) {
        memory.createFile('.is/collections.json', JSON.stringify(payload))
    }

    function findCollections(): Promise<Collection[]> {
        return memory.readArray('.is/collections.json')
    }

    test('should list collections', async ({ expect }) => {
        const collections = CollectionFactory.createMany(5)

        saveCollections(collections)

        const result = await repository.list()

        expect(result).toEqual(collections)
    })

    test('should show collection by id', async ({ expect }) => {
        const collection = CollectionFactory.create()

        saveCollections([collection])

        const result = await repository.show(collection.id)

        expect(result).toEqual(collection)
    })

    test('should create a collections', async ({ expect }) => {
        const payload = CollectionFactory.create()

        await repository.create(payload)

        const result = await findCollections()

        expect(result[0]).toEqual(payload)
    })

    test('should update a collection', async ({ expect }) => {
        const collection = CollectionFactory.create()

        saveCollections([collection])

        await repository.update(collection.id, {
            name: 'update',
        })

        const result = await findCollections()

        expect(result[0].name).toEqual('update')
    })

    test('should update method throw an error if collection was not found', async ({ expect }) => {
        expect.assertions(1)

        await repository
            .update('invalid', {
                name: 'update',
            })
            .catch((err) => expect(err).toEqual(new CollectionNotFound('invalid')))
    })

    test('should destroy method throw an error if collection was not found', async ({ expect }) => {
        expect.assertions(1)

        await repository
            .destroy('invalid')
            .catch((err) => expect(err).toEqual(new CollectionNotFound('invalid')))
    })

    test('should delete a collection', async ({ expect }) => {
        const collection = CollectionFactory.create()

        saveCollections([collection])

        await repository.destroy(collection.id)

        const result = await findCollections()

        expect(result.length).toBe(0)
    })
})
