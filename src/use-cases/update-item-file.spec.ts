import { test } from '@japa/runner'
import ItemIsNotAFile from 'Errors/ItemIsNotAFile'
import ItemNotFound from 'Errors/ItemNotFound'
import WorkspaceNotFound from 'Errors/WorkspaceNotFound'
import ItemFactory from 'src/__tests__/factories/ItemFactory'

import WorkspaceFactory from 'src/__tests__/factories/WorkspaceFactory'
import DriveFake from 'src/__tests__/providers/DriveFake'
import InMemoryItemsRepository from 'TestRepositories/InMemoryItemsRepository'
import InMemoryWorkspacesRepository from 'TestRepositories/InMemoryWorkspacesRepository'

import UpdateItemFile from './update-item-file'

test.group('use-cases: update-item-file', () => {
  const workspaceRepository = new InMemoryWorkspacesRepository()
  const itemRepository = new InMemoryItemsRepository()

  const workspaceFactory = new WorkspaceFactory(workspaceRepository)
  const itemFactory = new ItemFactory(itemRepository)

  const drive = new DriveFake()

  const updateItemFile = new UpdateItemFile(workspaceRepository, itemRepository, drive)

  test('should update a file content with buffer', async ({ expect }) => {
    const workspace = await workspaceFactory.create()
    const item = await itemFactory.create(workspace)

    drive.files.push({
      workspaceId: workspace.id,
      path: item.path,
      content: Buffer.from('foo'),
    })

    const args = {
      workspaceId: workspace.id,
      path: item.path,
      content: Buffer.from('new content'),
    }

    await updateItemFile.execute(args)

    const file = await drive.get(workspace, item.path)

    expect(file).toBe(args.content)
  })

  test('should update a file content with string', async ({ expect }) => {
    const workspace = await workspaceFactory.create()
    const item = await itemFactory.create(workspace)

    drive.files.push({
      workspaceId: workspace.id,
      path: item.path,
      content: Buffer.from('foo'),
    })

    const args = {
      workspaceId: workspace.id,
      path: item.path,
      content: 'update with string',
    }

    await updateItemFile.execute(args)

    const file = await drive.get(workspace, item.path)

    expect(file?.toString()).toBe('update with string')
  })

  test('should throw an error if the workspace does not exist', async ({ expect }) => {
    await expect(
      updateItemFile.execute({
        workspaceId: 'non-existing',
        path: 'foo',
        content: 'bar',
      })
    ).rejects.toThrow(new WorkspaceNotFound('non-existing'))
  })

  test('should throw an error if the item does not exist', async ({ expect }) => {
    const workspace = await workspaceFactory.create()

    await expect(
      updateItemFile.execute({
        workspaceId: workspace.id,
        path: 'foo',
        content: 'bar',
      })
    ).rejects.toThrow(new ItemNotFound(workspace.id, 'foo'))
  })

  test('should throw an error if the item its not a file', async ({ expect }) => {
    const workspace = await workspaceFactory.create()
    const item = await itemFactory.create(workspace, {
      type: 'folder',
    })

    await expect(
      updateItemFile.execute({
        workspaceId: workspace.id,
        path: item.path,
        content: 'bar',
      })
    ).rejects.toThrow(new ItemIsNotAFile(item.path))
  })
})
