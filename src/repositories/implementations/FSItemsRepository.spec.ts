import { test } from '@japa/runner'
import path from 'path'

import FSDrive from 'Providers/implementations/FSDrive'
import { WorkspaceFactory } from 'Tests/factories'
import { clean, createFile, createFolder, createManyFiles } from 'Tests/fixtures/filesystem'
import { exists, readFileIfExist } from 'Utils/filesystem'
import { pathToArray } from 'Utils/paths'
import FsItemsRepository from './FSItemsRepository'
import FSWorkspacesRepository from './FSWorkspacesRepository'

test.group('FSItemsRepository', (group) => {
  group.tap((t) => t.tags(['unit', 'fs']))

  let workspaceRepository: FSWorkspacesRepository
  let repository: FsItemsRepository

  let workspaceFactory: WorkspaceFactory
  let drive: FSDrive

  group.each.setup(async () => {
    const workspaceJson = await createFile('workspaces.json', JSON.stringify([]))

    drive = new FSDrive()
    workspaceRepository = new FSWorkspacesRepository(workspaceJson)
    repository = new FsItemsRepository(workspaceRepository, drive)

    workspaceFactory = new WorkspaceFactory(workspaceRepository)

    return () => clean()
  })

  test('should return items array', async ({ expect }) => {
    const workspace = await workspaceFactory.create({
      path: await createFolder('workspace1'),
    })

    await workspaceFactory.create({
      path: await createFolder('workspace2'),
    })

    await createManyFiles('/workspace1', 5)
    await createManyFiles('/workspace2', 5)

    const result = await repository.index({
      where: { workspaceId: workspace.id },
    })

    expect(result.length).toBe(5)
  })

  test('should return items filtered by parentId', async ({ expect }) => {
    const workspace = await workspaceFactory.create({
      path: await createFolder('workspace'),
    })

    await createManyFiles('/workspace/children', 5)

    const result = await repository.index({
      where: { parentId: 'children', workspaceId: workspace.id },
    })

    expect(result.length).toBe(5)
  })

  test('should return item by id', async ({ expect }) => {
    const workspace = await workspaceFactory.create({
      path: await createFolder('workspace'),
    })

    await createFile('/workspace/children')

    const result = await repository.find(`/${workspace.id}/children`)

    expect(result).toBeDefined()
  })

  test('should create a new item folder', async ({ expect }) => {
    const workspace = await workspaceFactory.create({
      path: await createFolder('workspace'),
    })

    await repository.create({
      filepath: '/new-item',
      name: 'new-item',
      type: 'folder',
      workspaceId: workspace.id,
    })

    const filepath = path.resolve(workspace.path, 'new-item')

    const created = await exists(filepath)

    expect(created).toBeTruthy()
  })

  test('should create a new item file', async ({ expect }) => {
    const workspace = await workspaceFactory.create({
      path: await createFolder('workspace'),
    })

    await repository.create(
      {
        filepath: '/new-item.txt',
        name: 'new-item',
        type: 'file',
        workspaceId: workspace.id,
      },
      Buffer.from('hello word')
    )

    const filepath = path.resolve(workspace.path, 'new-item.txt')

    const created = await readFileIfExist(filepath, 'utf8')

    expect(created).toBe('hello word')
  })

  test('should update item', async ({ expect }) => {
    const workspace = await workspaceFactory.create({
      path: await createFolder('workspace'),
    })

    const item = await repository.create(
      {
        filepath: '/new-item.txt',
        name: 'new-item',
        type: 'file',
        workspaceId: workspace.id,
      },
      Buffer.from('hello word')
    )

    await repository.update(
      item.id,
      {
        filepath: '/update-item.txt',
      },
      Buffer.from('update')
    )

    const filepath = path.resolve(workspace.path, 'update-item.txt')

    const created = await readFileIfExist(filepath, 'utf8')

    expect(created).toBe('update')
  })

  test('should delete item', async ({ expect }) => {
    const workspace = await workspaceFactory.create({
      path: await createFolder('workspace'),
    })

    const filepath = await createFile('workspace/new-item.txt')

    await repository.delete(`/${workspace.id}/new-item.txt`)

    const deleted = await exists(filepath)

    expect(deleted).toBeFalsy()
  })

  test('should read big quantity of files', async ({ expect }) => {
    const workspace = await workspaceFactory.create({
      path: await createFolder('workspace'),
    })

    const length = 10000

    await createManyFiles('/workspace', length)

    const result = await repository.index({
      where: { workspaceId: workspace.id },
    })

    expect(result).toHaveLength(length)
  }).timeout(20000)
})
