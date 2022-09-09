import { it, afterEach, expect } from 'vitest'
import DirectoryEntry from '../../../core/entities/directory-entry'
import TestFS from '../../__tests__/fixtures/test-fs'

import FSDrive from './fs-drive'

const drive = new FSDrive()

const testFs = new TestFS()

drive.config.path = testFs.tmpdir

afterEach(() => testFs.clear())

it('should list files', async () => {

    await testFs.createManyFiles(5)

    const entries = await drive.list('/')

    expect(entries.length).toBe(5)
})

it('should list files in subdirectory', async () => {

    await testFs.createDir('sub-dir')

    await testFs.createFile('sub-dir/test.txt')

    const entries = await drive.list('/sub-dir')

    expect(entries[0]).toEqual(DirectoryEntry.file('sub-dir/test.txt'))
})

it('should exist() method tell if entry exists or not', async () => {
    await testFs.createDir('sub-dir')

    await testFs.createFile('sub-dir/test.txt')

    expect(await drive.exists('not-exist.txt')).toBeFalsy()
    
    expect(await drive.exists('sub-dir/test.txt')).toBeTruthy()

})

it('should return an entry by filepath', async () => {
    await testFs.createFile('test.txt')

    const entry = await drive.get('test.txt')

    expect(entry).toEqual(DirectoryEntry.file('test.txt'))
})

it('should create a file', async () => {
    const entry = DirectoryEntry.file('new-item.txt')

    await drive.create(entry)

    const exists = await testFs.exists('new-item.txt')

    expect(exists).toBeTruthy()
})

it('should create a directory', async () => {
    const entry = DirectoryEntry.directory('new-item')

    await drive.create(entry)

    const exists = await testFs.exists('new-item', 'directory')

    expect(exists).toBeTruthy()
})

it('should delete a file', async () => {
    await testFs.createFile('test.txt')
    
    await drive.delete('test.txt')

    expect(await testFs.exists('test.txt')).toBeFalsy()
})