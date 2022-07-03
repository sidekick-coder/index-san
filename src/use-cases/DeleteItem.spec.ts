import { test } from '@japa/runner'
import ItemNotFound from 'Errors/ItemNotFound'
import InMemoryDrive from 'Providers/implementations/InMemoryDrive'
import InMemoryItemsRepository from 'Repositories/implementations/InMemoryItemsRepository'
import { ItemFactory } from 'Tests/factories'
import DeleteItem from './DeleteItem'

test.group('DeleteItem (unit)', (group) => {
  const drive = new InMemoryDrive()
  const repository = new InMemoryItemsRepository(drive)

  const itemFactory = new ItemFactory(repository)

  const useCase = new DeleteItem(repository)

  group.each.setup(() => (repository.items = []))

  test('should delete an item', async ({ expect }) => {
    const item = await itemFactory.create()

    await useCase.execute({ id: item.id })

    expect(repository.items).toHaveLength(0)
  })

  test('should also delete file from drive when item type is file', async ({ expect }) => {
    const item = await repository.create(
      itemFactory.make({ type: 'file' }),
      Buffer.from('hello word')
    )

    await useCase.execute({ id: item.id })

    expect(drive.files.get(item.filepath)).toBeUndefined()
  })

  test('should throw an error when item is not found', async ({ expect }) => {
    await expect(useCase.execute({ id: '' })).rejects.toThrow(new ItemNotFound())
  })
})
