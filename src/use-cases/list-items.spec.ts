import { test } from '@japa/runner'
import ItemFactory from 'src/__tests__/factories/ItemFactory'
import WorkspaceFactory from 'src/__tests__/factories/WorkspaceFactory'
import InMemoryItemsRepository from 'TestRepositories/InMemoryItemsRepository'
import InMemoryMetadataRepository from 'TestRepositories/InMemoryMetadataRepository'
import InMemoryWorkspacesRepository from 'TestRepositories/InMemoryWorkspacesRepository'

import ListItems from './list-items'

test.group('use-case: list-items', () => {
  const workspaceRepository = new InMemoryWorkspacesRepository()
  const itemRepository = new InMemoryItemsRepository()
  const metadataRepository = new InMemoryMetadataRepository()

  const workspaceFactory = new WorkspaceFactory(workspaceRepository)
  const itemFactory = new ItemFactory(itemRepository)

  const listItems = new ListItems(workspaceRepository, itemRepository, metadataRepository)

  test('should list all items in a workspace', async ({ expect }) => {
    const workspace = await workspaceFactory.create()
    const items = await itemFactory.createMany(workspace)

    const result = await listItems.execute({
      workspaceId: workspace.id,
    })

    expect(result).toEqual(items)
  })

  test('should return items with metadata', async ({ expect }) => {
    const workspace = await workspaceFactory.create()
    const items = await itemFactory.createMany(workspace)

    metadataRepository.metas.set(items[0].path, {
      displayName: 'foo',
    })

    const [result] = await listItems.execute({
      workspaceId: workspace.id,
    })

    expect(result.metas).toEqual({ displayName: 'foo' })
  })

  test('should filter items by parent path', async ({ expect }) => {
    const workspace = await workspaceFactory.create()
    const parent = await itemFactory.create(workspace, { name: 'parent' })
    const child = await itemFactory.create(workspace, {
      name: 'child',
      path: parent.path + '/child',
    })

    const result = await listItems.execute({
      workspaceId: workspace.id,
      filters: {
        parentPath: parent.path,
      },
    })

    expect(result).toHaveLength(1)

    expect(result).toEqual([child])
  })
})
