import { test } from '@japa/runner'
import { faker } from '@faker-js/faker'

import DirectoryEntry from '../../../entities/directory-entry'
import Item from '../../../entities/item'
import DriveManager from '../../../gateways/drive/manager'
import CollectionFactory from '../../../__tests__/factories/collections'
import InMemoryDrive from '../../../__tests__/gateways/in-memory-drive'
import EntryItemRepository from './entry-item-repository'
import ItemNotFound from '../../../exceptions/item-not-found'

test.group('entry-item-repository (repository)', (group) => {
    const memory = new InMemoryDrive()

    const manager = new DriveManager({ memory }, 'memory')

    const repository = new EntryItemRepository(manager)

    const collection = CollectionFactory.create()

    function saveMetas(metas: any[]) {
        memory.createFile(DirectoryEntry.normalize(collection.path, '.is', 'metas.json'), metas)
    }

    function getMetas() {
        return memory.readArray(DirectoryEntry.normalize(collection.path, '.is', 'metas.json'))
    }

    group.each.teardown(() => memory.clear())

    test('should list entries as items', async ({ expect }) => {
        const items = Array.from({ length: 20 })
            .map((_, i) => String(i))
            .map((i) => memory.createDir(collection.path, i))
            .map(({ name }) => {
                const data = {
                    gender: faker.name.gender(),
                    age: faker.datatype.number({ min: 1, max: 99 }),
                }

                return new Item(data, name)
            })

        saveMetas(items)

        const result = await repository.list(collection)

        expect(result).toEqual(items)
    })

    test('should show method return a item by id', async ({ expect }) => {
        const entry = memory.createDir(collection.path, 'hello-word')

        const result = await repository.show(collection, entry.name)

        expect(result).toEqual(new Item({}, entry.name))
    })

    test('should show method throw an error if item not exists', async ({ expect }) => {
        expect.assertions(1)

        await repository
            .show(collection, 'invalid')
            .catch((err) => expect(err).toEqual(new ItemNotFound(collection.path, 'invalid')))
    })

    test('should create a item', async ({ expect }) => {
        const item = new Item({ age: faker.random.numeric() }, 'hello')

        await repository.create(collection, item)

        const [result] = await repository.list(collection)

        expect(result.id).toEqual(item.id)
        expect(result.age).toEqual(item.age)

        expect(manager.exists(collection.path, 'hello'))
    })

    test('should update method throw an error if item not exists', async ({ expect }) => {
        expect.assertions(1)

        await repository
            .update(collection, 'invalid', {
                hello: 'word',
            })
            .catch((err) => expect(err).toEqual(new ItemNotFound(collection.path, 'invalid')))
    })

    test('should update a item', async ({ expect }) => {
        const item = await repository.create(
            collection,
            new Item({ age: faker.random.numeric() }, 'hello')
        )

        saveMetas([item])

        await repository.update(collection, item.id, {
            hello: 'word',
        })

        const [result] = await repository.list(collection)

        expect(result.id).toBe(item.id)
        expect(result.age).toBe(item.age)
        expect(result.hello).toBe('word')
        expect(result._createdAt).toBe(item._createdAt)
        expect(result._updatedAt).not.toBe(item._updatedAt)
    })

    test('should update method move item folder when id is defined', async ({ expect }) => {
        const item = await repository.create(
            collection,
            new Item({ age: faker.random.numeric() }, 'hello')
        )

        saveMetas([item])

        await repository.update(collection, item.id, {
            id: 'new-dir',
        })

        const newItem = await repository.show(collection, 'new-dir')

        const folderExists = await manager.exists(collection.path, 'new-dir')

        expect(folderExists).toBe(true)
        expect(newItem.age).toBe(item.age)
    })

    test('should destroy method throw an error if item not exists', async ({ expect }) => {
        expect.assertions(1)

        await repository
            .destroy(collection, 'invalid')
            .catch((err) => expect(err).toEqual(new ItemNotFound(collection.path, 'invalid')))
    })

    test('should delete an item', async ({ expect }) => {
        const item = await repository.create(
            collection,
            new Item({ age: faker.random.numeric() }, 'hello')
        )

        saveMetas([item])

        await repository.destroy(collection, item.id)

        const items = await repository.list(collection)
        const metas = await getMetas()

        expect(items.length).toBe(0)
        expect(metas.length).toBe(0)
    })
})
