import { afterEach, expect, it, describe } from 'vitest'
import TestFS from '../../__tests__/fixtures/test-fs'
import FolderCrud from './fs-crud-folder'
import FSDrive from './fs-drive'

const crud = new FolderCrud()
const testFS = new TestFS()
const drive = new FSDrive()

drive.config.path = testFS.tmpdir

crud.drive = drive

describe('fs-crud-folder.ts', () => {
    afterEach(() => testFS.clear())
    
    it('should list directory-entries as items', async () => {
        await testFS.createDir('collection-01')
    
        await testFS.createManyDir(5, 'collection-01/item-')
    
        const items = await crud.list('collection-01')
    
        expect(items.length).toBe(5)
    })
    
    it('should list only directories', async () => {
        await testFS.createDir('collection-01')
    
        await testFS.createManyFiles(5, 'collection-01/file-')
        await testFS.createManyDir(5, 'collection-01/folder-')
    
        const items = await crud.list('collection-01')
    
        expect(items.length).toBe(5)
    })
    
    it('should return an item by id', async () => {
        await testFS.createDir('collection-01')
    
        await testFS.createDir('collection-01/item-01')
    
        const item = await crud.findById('collection-01', 'item-01')
    
        expect(item?.id).toBe('item-01')
    })
    
    it('should create a new item',  async () => {
        await testFS.createDir('collection-01')
    
        await crud.create('collection-01', {
            id: 'new-item'
        })
    
        expect(await testFS.exists('collection-01/new-item')).toBeTruthy()
    })
    
    it('should create a item with metadata', async () => {
        await testFS.createDir('collection-01')
    
        await crud.create('collection-01', {
            id: 'new-item',
            hello: 'Hello word'
        })
    
        const item = await crud.findById('collection-01', 'new-item')
    
        expect(item?.hello).toBe('Hello word')
    })
    
    it('should update an item', async () => {
        await testFS.createDir('collection-01/item-01')
    
        let item = await crud.findById('collection-01', 'item-01')
    
        expect(item?.hello).toBeUndefined()
    
        await crud.updateById('collection-01', 'item-01', {
            hello: 'update item'
        })
    
        item = await crud.findById('collection-01', 'item-01')
    
        expect(item?.hello).toBe('update item')
    })
    
    it('should delete an item', async () => {
        await testFS.createDir('collection-01/item-01')
    
        await crud.deleteById('collection-01', 'item-01')
    
        expect(await testFS.exists('collection/item-01')).toBeFalsy()
    })
})