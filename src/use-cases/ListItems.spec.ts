import { test } from '@japa/runner'
import InMemoryItemsRepository from 'Repositories/implementations/InMemoryItemsRepository'
import { ItemFactory, WorkspaceFactory } from 'Tests/factories'
import ListItems from './ListItems'

test.group('ListItems (unit)', (group) => {
  const repository = new InMemoryItemsRepository()

  const workspaceFactory = new WorkspaceFactory(repository.workspacesRepository)
  const itemFactory = new ItemFactory(repository)

  const useCase = new ListItems(repository)

  group.each.setup(() => (repository.items = []))

  test('should return list of items', async ({ expect }) => {
    const workspace = await workspaceFactory.create()

    await itemFactory.createMany({ workspaceId: workspace.id }, 20)

    const result = await useCase.execute()

    expect(result.length).toEqual(20)
  })
})
