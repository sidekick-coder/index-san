import { test } from '@japa/runner'
import path from 'path'

import FSDrive from 'Providers/implementations/FSDrive'
import {
  clean,
  createFile,
  createFolder,
  createManyFiles,
  makePath,
} from 'Tests/fixtures/filesystem'
import { exists, readFileIfExist } from 'Utils/filesystem'
import FsItemsRepository from './FSItemsRepository'

test.group('FSItemsRepository', (group) => {
  group.tap((t) => t.tags(['unit', 'fs']))
  let repository: FsItemsRepository

  let drive: FSDrive

  group.each.setup(async () => {
    drive = new FSDrive()
    repository = new FsItemsRepository(drive)

    return () => clean()
  })

  test('should return items array', async ({ expect }) => {
    const filename = await createFolder('workspace')

    await createManyFiles('/workspace', 5)

    const result = await repository.index({
      where: { parentId: filename },
    })

    expect(result.length).toBe(5)
  })

  test('should return items filtered by parentId', async ({ expect }) => {
    const filepath = await createFolder('/workspace/children')

    await createManyFiles('/workspace/children', 5)

    const result = await repository.index({
      where: { parentId: filepath },
    })

    expect(result.length).toBe(5)
  })

  test('should return item by id', async ({ expect }) => {
    const filepath = await createFile('/workspace/children')

    const result = await repository.find(filepath)

    expect(result).toBeDefined()
  })

  test('should create a new item folder', async ({ expect }) => {
    const filepath = makePath('/workspace/new-item')

    await repository.create({
      filepath,
      name: 'new-item',
      type: 'folder',
    })

    const created = await exists(filepath)

    expect(created).toBeTruthy()
  })

  test('should create a new item file', async ({ expect }) => {
    const filepath = makePath('/workspace/new-item.txt')

    await repository.create(
      {
        filepath,
        name: 'new-item',
        type: 'file',
      },
      Buffer.from('hello word')
    )

    const created = await readFileIfExist(filepath, 'utf8')

    expect(created).toBe('hello word')
  })

  test('should update item', async ({ expect }) => {
    const filepath = makePath('/workspace/new-item.txt')

    const item = await repository.create(
      {
        filepath,
        name: 'new-item',
        type: 'file',
      },
      Buffer.from('hello word')
    )

    await repository.update(
      item.id,
      {
        filepath: makePath('/workspace/update-item.txt'),
      },
      Buffer.from('update')
    )

    const created = await readFileIfExist(makePath('/workspace/update-item.txt'), 'utf8')

    expect(created).toBe('update')
  })

  test('should delete item', async ({ expect }) => {
    const filepath = await createFile('workspace/new-item.txt')

    await repository.delete(filepath)

    const deleted = await exists(filepath)

    expect(deleted).toBeFalsy()
  })

  test('should read big quantity of files')
    .timeout(20000)
    .run(async ({ expect }) => {
      const length = 10000

      const filepath = await createFolder('/workspace')

      await createManyFiles('/workspace', length)

      const result = await repository.index({
        where: { parentId: filepath },
      })

      expect(result).toHaveLength(length)
    })
})
