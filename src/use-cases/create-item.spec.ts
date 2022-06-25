import { test } from '@japa/runner'
import { ItemFactory, WorkspaceFactory } from 'Tests/factories'
import InMemoryItemsRepository from 'Repositories/implementations/InMemoryItemsRepository'
import InMemoryWorkspacesRepository from 'Repositories/implementations/InMemoryWorkspacesRepository'
import CreateItem from './create-item'
import WorkspaceNotFound from 'Errors/WorkspaceNotFound'
import ItemAlreadyExists from 'Errors/ItemAlreadyExists'

test.group('use-case: create-item', () => {
  const workspaceRepository = new InMemoryWorkspacesRepository()
  const itemRepository = new InMemoryItemsRepository(workspaceRepository)

  const itemFactory = new ItemFactory(itemRepository)
  const workspaceFactory = new WorkspaceFactory(workspaceRepository)

  const createItem = new CreateItem(workspaceRepository, itemRepository)

  test('should add an item to the workspace', async ({ expect }) => {
    const workspace = await workspaceFactory.create()

    await createItem.execute({
      id: 'C:\\fake-path\\Root\\test.txt',
      name: 'test.txt',
      workspaceId: workspace.id,
      type: 'file',
    })

    expect(itemRepository.items).toHaveLength(1)
  })

  test('should throw an error if the workspace does not exist', async ({ expect }) => {
    const data = itemFactory.make({
      name: 'test.txt',
      path: 'C:\\fake-path\\Root\\test.txt',
      workspaceId: 'non-existing',
      type: 'file',
    })

    await expect(createItem.execute(data)).rejects.toThrow(new WorkspaceNotFound())
  })

  test('should throw an error if item already exists', async ({ expect }) => {
    const workspace = await workspaceFactory.create()

    const data = itemFactory.make({
      id: '/deep/test.txt',
      name: 'test.txt',
      workspaceId: workspace.id,
    })

    await createItem.execute(data)

    await expect(createItem.execute(data)).rejects.toThrow(new ItemAlreadyExists())
  })
})
