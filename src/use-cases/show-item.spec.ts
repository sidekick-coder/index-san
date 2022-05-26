import { test } from '@japa/runner'
import ItemNotFound from 'Errors/ItemNotFound'
import WorkspaceNotFound from 'Errors/WorkspaceNotFound'
import ItemFactory from 'src/__tests__/factories/ItemFactory'
import WorkspaceFactory from 'src/__tests__/factories/WorkspaceFactory'
import InMemoryItemsRepository from 'TestRepositories/InMemoryItemsRepository'
import InMemoryMetadataRepository from 'TestRepositories/InMemoryMetadataRepository'
import InMemoryWorkspacesRepository from 'TestRepositories/InMemoryWorkspacesRepository'
import ShowItem from './show-item'

test.group('use-case: show-item', () => {
  const workspaceRepository = new InMemoryWorkspacesRepository()
  const itemsRepository = new InMemoryItemsRepository()
  const metadataRepository = new InMemoryMetadataRepository()

  const workspaceFactory = new WorkspaceFactory(workspaceRepository)
  const itemFactory = new ItemFactory(itemsRepository)

  const showItem = new ShowItem(workspaceRepository, itemsRepository, metadataRepository)

  test('show return item by path', async ({ expect }) => {
    const workspace = await workspaceFactory.create()
    const item = await itemFactory.create(workspace, {
      path: workspace.path + '/foo',
    })

    const result = await showItem.execute({
      workspaceId: workspace.id,
      path: item.path,
    })

    expect(result).toBe(item)
  })

  test('should item be returned with metadata', async ({ expect }) => {
    const workspace = await workspaceFactory.create()
    const item = await itemFactory.create(workspace, {
      path: workspace.path + '/foo',
    })

    metadataRepository.metas.set(item.path, {
      foo: 'bar',
    })

    const result = await showItem.execute({
      workspaceId: workspace.id,
      path: item.path,
    })

    expect(result.metas).toEqual({ foo: 'bar' })
  })

  test('should throw an error if the workspace does not exist', async ({ expect }) => {
    await expect(
      showItem.execute({
        workspaceId: 'non-existing',
        path: 'foo',
      })
    ).rejects.toThrow(new WorkspaceNotFound('non-existing'))
  })

  test('should throw an error if the item does not exist', async ({ expect }) => {
    const workspace = await workspaceFactory.create()
    await expect(
      showItem.execute({
        workspaceId: workspace.id,
        path: 'foo',
      })
    ).rejects.toThrow(new ItemNotFound(workspace.id, 'foo'))
  })
})
