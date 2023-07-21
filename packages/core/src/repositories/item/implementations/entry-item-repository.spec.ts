import { test } from '@japa/runner'
import { faker } from '@faker-js/faker'

import DirectoryEntry from '../../../entities/directory-entry'
import Item from '../../../entities/item'
import CollectionFactory from '../../../__tests__/factories/collections'
import InMemoryDrive from '../../../__tests__/gateways/in-memory-drive'
import EntryItemRepository from './entry-item-repository'
import ItemNotFound from '../../../exceptions/item-not-found'

test.group('entry-item-repository (repository)', (group) => {
    const drive = new InMemoryDrive()

    const collection = CollectionFactory.create()

    const repository = new EntryItemRepository(collection, drive)

    function saveMetas(metas: any[]) {
        drive.createFile(DirectoryEntry.normalize(collection.path, '.is', 'metas.json'), metas)
    }

    function getMetas() {
        return drive.readArray(DirectoryEntry.normalize(collection.path, '.is', 'metas.json'))
    }

    group.each.teardown(() => drive.clear())

    test('should list entries as items', async ({ expect }) => {
        const items = Array.from({ length: 20 })
            .map((_, i) => String(i))
            .map((i) => drive.createDir(collection.path, i))
            .map(({ name }) => {
                const item = new Item({}, name)

                item.gender = faker.person.gender()
                item.age = faker.datatype.number({ min: 1, max: 99 })

                item._path = DirectoryEntry.normalize(collection.path, name)

                return item
            })

        saveMetas(items)

        const result = await repository.list()

        expect(result).toEqual(items)
    })

    test('should show method return a item by id', async ({ expect }) => {
        const entry = drive.createDir(collection.path, 'hello-word')

        const result = await repository.show(entry.name)

        const item = new Item({}, entry.name)

        item._path = DirectoryEntry.normalize(collection.path, item.id)

        expect(result).toEqual(item)
    })

    test('should show method throw an error if item not exists', async ({ expect }) => {
        expect.assertions(1)

        await repository
            .show('invalid')
            .catch((err) => expect(err).toEqual(new ItemNotFound(collection.path, 'invalid')))
    })

    test('should create a item', async ({ expect }) => {
        const item = new Item({ age: faker.random.numeric() }, 'hello')

        await repository.create(item)

        const [result] = await repository.list()

        expect(result.id).toEqual(item.id)
        expect(result.age).toEqual(item.age)

        const folderExists = await drive.exists(DirectoryEntry.normalize(collection.path, 'hello'))

        expect(folderExists).toBe(true)
    })

    test('should update method throw an error if item not exists', async ({ expect }) => {
        expect.assertions(1)

        await repository
            .update('invalid', {
                hello: 'word',
            })
            .catch((err) => expect(err).toEqual(new ItemNotFound(collection.path, 'invalid')))
    })

    test('should update a item', async ({ expect }) => {
        const item = await repository.create(new Item({ age: faker.random.numeric() }, 'hello'))

        saveMetas([item])

        await repository.update(item.id, {
            hello: 'word',
        })

        const [result] = await repository.list()

        expect(result.id).toBe(item.id)
        expect(result.age).toBe(item.age)
        expect(result.hello).toBe('word')
        expect(result._createdAt).toBe(item._createdAt)
        expect(result._updatedAt).not.toBe(item._updatedAt)
    })

    test('should update method move item folder when id is defined', async ({ expect }) => {
        const item = await repository.create(new Item({ age: faker.random.numeric() }, 'hello'))

        saveMetas([item])

        await repository.update(item.id, {
            id: 'new-dir',
        })

        const newItem = await repository.show('new-dir')

        const folderExists = await drive.exists(
            DirectoryEntry.normalize(collection.path, 'new-dir')
        )

        expect(folderExists).toBe(true)
        expect(newItem.age).toBe(item.age)
    })

    test('should destroy method throw an error if item not exists', async ({ expect }) => {
        expect.assertions(1)

        await repository
            .destroy('invalid')
            .catch((err) => expect(err).toEqual(new ItemNotFound(collection.path, 'invalid')))
    })

    test('should delete an item', async ({ expect }) => {
        const item = await repository.create(new Item({ age: faker.random.numeric() }, 'hello'))

        saveMetas([item])

        await repository.destroy(item.id)

        const items = await repository.list()
        const metas = await getMetas()

        expect(items.length).toBe(0)
        expect(metas.length).toBe(0)
    })
})
