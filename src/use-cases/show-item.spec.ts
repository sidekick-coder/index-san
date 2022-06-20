import { test } from '@japa/runner'
import ItemNotFound from 'Errors/ItemNotFound'
import WorkspaceNotFound from 'Errors/WorkspaceNotFound'
import { ItemFactory, WorkspaceFactory } from 'Tests/factories'
import InMemoryItemsRepository from 'Repositories/implementations/InMemoryItemsRepository'
import ShowItem from './show-item'

test.group('use-case: show-item', () => {
  const repository = new InMemoryItemsRepository()

  const workspaceFactory = new WorkspaceFactory(repository._workspacesRepository)
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

  test('should item be returned with metadata', async ({ expect }) => {
    const workspace = await workspaceFactory.create()

    const item = await itemFactory.create({
      id: workspace.id + '/foo',
      workspaceId: workspace.id,
    })

    await repository._metasRepository.create({
      workspaceId: workspace.id,
      itemId: item.id,
      foo: 'bar',
    })

    const result = await showItem.execute({
      workspaceId: workspace.id,
      id: item.id,
    })

    expect(result.foo).toBe('bar')
  })

  test('should throw an error if the workspace does not exist', async ({ expect }) => {
    await expect(
      showItem.execute({
        workspaceId: 'non-existing',
        id: 'foo',
      })
    ).rejects.toThrow(new WorkspaceNotFound())
  })

  test('should throw an error if the item does not exist', async ({ expect }) => {
    const workspace = await workspaceFactory.create()
    await expect(
      showItem.execute({
        workspaceId: workspace.id,
        id: 'foo',
      })
    ).rejects.toThrow(new ItemNotFound())
  })
})
