import { afterEach, expect, it, describe } from 'vitest'
import TestDrive from '@core/__tests__/gateways/in-memory-drive'
import FolderCrud from './fs-crud-folder'

const crud = new FolderCrud()
const drive = new TestDrive()

crud.drive = drive

describe('fs-crud-folder.ts', () => {
    afterEach(() => drive.clear())

    it('should list directory-entries as items', async () => {
        drive.createDir('collection-01')

        for (let i = 0; i < 5; i++) {
            drive.createDir(`collection-01/item-${i}`)
        }

        const items = await crud.list('collection-01')

        expect(items.length).toBe(5)
    })

    it('should list only directories', async () => {
        drive.createDir('collection-01')

        for (let i = 0; i < 5; i++) {
            drive.createDir(`collection-01/folder-${i}`)
        }

        for (let i = 0; i < 5; i++) {
            drive.createFile(`collection-01/file-${i}`)
        }

        const items = await crud.list('collection-01')

        expect(items.length).toBe(5)
    })

    it('should return an item by id', async () => {
        drive.createDir('collection-01')

        drive.createDir('collection-01/item-01')

        const item = await crud.findById('collection-01', 'item-01')

        expect(item?.id).toBe('item-01')
    })

    it('should create a new item', async () => {
        drive.createDir('collection-01')

        await crud.create('collection-01', {
            id: 'new-item',
        })

        expect(await drive.exists('collection-01/new-item')).toBeTruthy()
    })

    it('should create a item with metadata', async () => {
        const collectionId = 'collection-01'

        drive.createDir(collectionId)

        await crud.create('collection-01', {
            id: 'new-item',
            hello: 'Hello word',
        })

        const item = await crud.findById(collectionId, 'new-item')

        expect(item?.hello).toBe('Hello word')
    })

    it('should update an item', async () => {
        drive.createDir('collection-01/item-01')

        const old = await crud.findById('collection-01', 'item-01')

        expect(old?.hello).toBeUndefined()

        await crud.updateById('collection-01', 'item-01', {
            hello: 'update item',
        })

        const result = await crud.findById('collection-01', 'item-01')

        expect(result?.hello).toBe('update item')
    })

    it('should delete an item', async () => {
        drive.createDir('collection-01/item-01')

        await crud.deleteById('collection-01', 'item-01')

        expect(await drive.exists('collection/item-01')).toBeFalsy()
    })
})
