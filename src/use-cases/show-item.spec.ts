import { test } from '@japa/runner'
import { ItemFactory, WorkspaceFactory } from 'Tests/factories'
import InMemoryItemsRepository from 'Repositories/implementations/InMemoryItemsRepository'
import ShowItem from './show-item'

test.group('use-case: show-item', () => {
  const repository = new InMemoryItemsRepository()

  const workspaceFactory = new WorkspaceFactory(repository.workspacesRepository)
  const itemFactory = new ItemFactory(repository)

  const showItem = new ShowItem(repository)

  test('show return item by id', async ({ expect }) => {
    const workspace = await workspaceFactory.create()

    const item = await itemFactory.create({
      id: workspace.id + '/foo',
      workspaceId: workspace.id,
    })

    const result = await showItem.execute({
      workspaceId: workspace.id,
      id: item.id,
    })

    expect(result).toBe(item)
  })
})
