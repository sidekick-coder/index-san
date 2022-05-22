import { test } from '@japa/runner'
import ItemIsNotAFile from 'Errors/ItemIsNotAFile'
import ItemNotFound from 'Errors/ItemNotFound'
import WorkspaceNotFound from 'Errors/WorkspaceNotFound'
import ItemFactory from 'src/__tests__/factories/ItemFactory'
import WorkspaceFactory from 'src/__tests__/factories/WorkspaceFactory'
import DriveFake from 'src/__tests__/providers/DriveFake'
import InMemoryItemsRepository from 'TestRepositories/InMemoryItemsRepository'
import InMemoryWorkspacesRepository from 'TestRepositories/InMemoryWorkspacesRepository'
import ShowItemFile from './show-item-file'

test.group('use-case: show-file', () => {
  const workspaceRepository = new InMemoryWorkspacesRepository()
  const itemsRepository = new InMemoryItemsRepository()
  const drive = new DriveFake()

  const workspaceFactory = new WorkspaceFactory(workspaceRepository)
  const itemsFactory = new ItemFactory(itemsRepository)

  const showItemFile = new ShowItemFile(workspaceRepository, itemsRepository, drive)

  test('should return file buffer', async ({ expect }) => {
    const workspace = await workspaceFactory.create()
    const item = await itemsFactory.create(workspace)

    drive.files.push({
      workspaceId: workspace.id,
      path: item.path,
      content: Buffer.from('foo'),
    })

    const result = await showItemFile.execute({
      workspaceId: workspace.id,
      path: item.path,
    })

    expect(result).toEqual(Buffer.from('foo'))
  })

  test('should throw an error if the workspace does not exist', async ({ expect }) => {
    await expect(
      showItemFile.execute({
        workspaceId: 'non-existing',
        path: 'foo',
      })
    ).rejects.toThrow(new WorkspaceNotFound('non-existing'))
  })

  test('should throw an error if the item does not exist', async ({ expect }) => {
    const workspace = await workspaceFactory.create()

    await expect(
      showItemFile.execute({
        workspaceId: workspace.id,
        path: 'foo',
      })
    ).rejects.toThrow(new ItemNotFound(workspace.id, 'foo'))
  })

  test('should throw an error if the item its not a file', async ({ expect }) => {
    const workspace = await workspaceFactory.create()
    const item = await itemsFactory.create(workspace, {
      type: 'folder',
    })

    await expect(
      showItemFile.execute({
        workspaceId: workspace.id,
        path: item.path,
      })
    ).rejects.toThrow(new ItemIsNotAFile(item.path))
  })
})
