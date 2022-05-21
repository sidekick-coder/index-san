import { test } from '@japa/runner'
import Workspace from 'Entities/Workspace'
import ItemNotFound from 'Errors/ItemNotFound'
import WorkspaceNotFound from 'Errors/WorkspaceNotFound'
import ConfigFactory from 'src/__tests__/factories/ConfigFactory'
import ItemFactory from 'src/__tests__/factories/ItemFactory'
import WorkspaceFactory from 'src/__tests__/factories/WorkspaceFactory'
import InMemoryConfigsRepository from 'TestRepositories/InMemoryConfigsRepository'
import InMemoryItemsRepository from 'TestRepositories/InMemoryItemsRepository'
import InMemoryWorkspacesRepository from 'TestRepositories/InMemoryWorkspacesRepository'
import ShowItem from './show-item'

test.group('use-case: show-item', () => {
  const workspaceRepository = new InMemoryWorkspacesRepository()
  const itemsRepository = new InMemoryItemsRepository()
  const configRepository = new InMemoryConfigsRepository()

  const workspaceFactory = new WorkspaceFactory(workspaceRepository)
  const itemFactory = new ItemFactory(itemsRepository)
  const configFactory = new ConfigFactory(configRepository)

  const showItem = new ShowItem(workspaceRepository, itemsRepository, configRepository)

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

  test('should item be returned with config if it exist', async ({ expect }) => {
    const workspace = await workspaceFactory.create()
    const item = await itemFactory.create(workspace, {
      path: workspace.path + '/foo',
    })

    const config = await configFactory.create(workspace, {
      name: item.path,
      value: { displayName: 'foo' },
    })

    const result = await showItem.execute({
      workspaceId: workspace.id,
      path: item.path,
    })

    expect(result.config).toBe(config)
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
