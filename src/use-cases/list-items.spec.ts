import { test } from '@japa/runner'
import { ItemFactory, WorkspaceFactory } from 'src/__tests__/factories'
import InMemoryItemsRepository from 'Repositories/implementations/InMemoryItemsRepository'

import ListItems from './list-items'
import Workspace from 'Entities/Workspace'

test.group('use-case: list-items', (group) => {
  const repository = new InMemoryItemsRepository()

  const workspaceFactory = new WorkspaceFactory(repository.workspacesRepository)
  const itemFactory = new ItemFactory(repository)

  const listItems = new ListItems(repository)
  let workspace: Workspace

  group.each.setup(async () => {
    workspace = await workspaceFactory.create()
  })

  test('should return a list of items', async ({ expect }) => {
    const items = await itemFactory.createMany({
      workspaceId: workspace.id,
    })

    const result = await listItems.execute()

    expect(result).toEqual(items)
  })
})
