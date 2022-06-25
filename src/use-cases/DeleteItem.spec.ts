import { test } from '@japa/runner'
import ItemNotFound from 'Errors/ItemNotFound'
import InMemoryDrive from 'Providers/implementations/InMemoryDrive'
import InMemoryItemsRepository from 'Repositories/implementations/InMemoryItemsRepository'
import { ItemFactory, WorkspaceFactory } from 'Tests/factories'
import DeleteItem from './DeleteItem'

test.group('DeleteItem (unit)', (group) => {
  const drive = new InMemoryDrive()
  const repository = new InMemoryItemsRepository(undefined, drive)

  const workspaceFactory = new WorkspaceFactory(repository.workspacesRepository)
  const itemFactory = new ItemFactory(repository)

  const useCase = new DeleteItem(repository)

  group.each.setup(() => (repository.items = []))

  test('should delete an item', async ({ expect }) => {
    const workspace = await workspaceFactory.create()
    const item = await itemFactory.create({ workspaceId: workspace.id })

    await useCase.execute({ id: item.id, workspaceId: workspace.id })

    expect(repository.items).toHaveLength(0)
  })

  test('should also delete file from drive when item type is file', async ({ expect }) => {
    const workspace = await workspaceFactory.create()

    const item = await repository.create(
      itemFactory.make({ workspaceId: workspace.id, type: 'file' }),
      Buffer.from('hello word')
    )

    await useCase.execute({ id: item.id, workspaceId: workspace.id })

    expect(drive.files).toHaveLength(0)
  })

  test('should throw an error when item is not found', async ({ expect }) => {
    await expect(useCase.execute({ id: '', workspaceId: '' })).rejects.toThrow(new ItemNotFound())
  })
})
