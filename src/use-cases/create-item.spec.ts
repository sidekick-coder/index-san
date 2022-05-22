import { test } from '@japa/runner'
import Workspace from 'Entities/Workspace'
import ItemFactory from 'src/__tests__/factories/ItemFactory'
import InMemoryItemsRepository from 'TestRepositories/InMemoryItemsRepository'
import InMemoryWorkspacesRepository from 'TestRepositories/InMemoryWorkspacesRepository'
import CreateItem from './create-item'

test.group('use-case: create-item', () => {
  const workspaceRepository = new InMemoryWorkspacesRepository()
  const itemRepository = new InMemoryItemsRepository()

  const itemFactory = new ItemFactory(itemRepository)

  const createItem = new CreateItem(workspaceRepository, itemRepository)

  test('should add an item to the workspace', async ({ expect }) => {
    const workspace = await workspaceRepository.create(
      new Workspace({
        name: 'Root',
        displayName: 'Root',
        path: 'C:\\fake-path\\Root',
      })
    )

    await createItem.execute({
      name: 'test.txt',
      path: 'C:\\fake-path\\Root\\test.txt',
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

    await expect(createItem.execute(data)).rejects.toThrow(
      'Workspace with id non-existing not found'
    )
  })

  test('should throw an error if item already exists', async ({ expect }) => {
    const workspace = await workspaceRepository.create(
      new Workspace({
        name: 'Root',
        displayName: 'Root',
        path: 'C:\\fake-path\\Root',
      })
    )

    const data = itemFactory.make({
      name: 'test.txt',
      path: '/deep/test.txt',
      workspaceId: workspace.id,
    })

    await createItem.execute(data)

    await expect(createItem.execute(data)).rejects.toThrow(
      'Item with path /deep/test.txt already exists'
    )
  })
})
