import { test } from '@japa/runner'
import ConfigFactory from 'src/__tests__/factories/ConfigFactory'
import ItemFactory from 'src/__tests__/factories/ItemFactory'
import WorkspaceFactory from 'src/__tests__/factories/WorkspaceFactory'
import InMemoryConfigsRepository from 'TestRepositories/InMemoryConfigsRepository'
import InMemoryItemsRepository from 'TestRepositories/InMemoryItemsRepository'
import InMemoryWorkspacesRepository from 'TestRepositories/InMemoryWorkspacesRepository'

import ListItems from './list-items'

test.group('use-case: list-items', () => {
  const workspaceRepository = new InMemoryWorkspacesRepository()
  const itemRepository = new InMemoryItemsRepository()
  const configRepository = new InMemoryConfigsRepository()

  const workspaceFactory = new WorkspaceFactory(workspaceRepository)
  const itemFactory = new ItemFactory(itemRepository)
  const configFactory = new ConfigFactory(configRepository)

  const listItems = new ListItems(workspaceRepository, itemRepository, configRepository)

  test('should list all items in a workspace', async ({ expect }) => {
    const workspace = await workspaceFactory.create()
    const items = await itemFactory.createMany(workspace)

    const result = await listItems.execute(workspace.id)

    expect(result).toEqual(items)
  })

  test('should return items with config if exists', async ({ expect }) => {
    const workspace = await workspaceFactory.create()
    const item = await itemFactory.create(workspace)
    const config = await configFactory.create(workspace, {
      name: item.path,
      value: { displayName: 'hello word' },
    })

    const [result] = await listItems.execute(workspace.id)

    expect(result).toEqual({
      ...item,
      config,
    })
  })
})
