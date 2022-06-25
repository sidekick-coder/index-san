import { test } from '@japa/runner'
import ItemNotFound from 'Errors/ItemNotFound'
import InMemoryItemsRepository from 'Repositories/implementations/InMemoryItemsRepository'
import { ItemFactory, WorkspaceFactory } from 'Tests/factories'
import UpdateItem from './UpdateItem'

test.group('UpdateItem (unit)', (group) => {
  const repository = new InMemoryItemsRepository()

  const workspaceFactory = new WorkspaceFactory(repository.workspacesRepository)
  const itemFactory = new ItemFactory(repository)

  const useCase = new UpdateItem(repository)

  group.each.setup(() => (repository.items = []))

  test('should update an item', async ({ expect }) => {
    const workspace = await workspaceFactory.create()

    const item = await itemFactory.create({ workspaceId: workspace.id })

    await useCase.execute({
      id: item.id,
      name: 'update-name',
    })

    expect(repository.items[0].name).toEqual('update-name')
  })

  test('should update file content when buffer is sended', async ({ expect }) => {
    const workspace = await workspaceFactory.create()

    const item = await repository.create(
      itemFactory.make({ workspaceId: workspace.id, type: 'file' }),
      Buffer.from('hello word')
    )

    await useCase.execute({
      id: item.id,
      name: 'update-name',
      content: Buffer.from('update buffer'),
    })

    const content = await repository.drive.get(repository.items[0].filepath)

    expect(content).toEqual(Buffer.from('update buffer'))
  })

  test('should throw an error when item is not found', async ({ expect }) => {
    await expect(useCase.execute({ id: '' })).rejects.toThrow(new ItemNotFound())
  })

  test('should throw an error when try update a folder with content', async ({ expect }) => {
    const workspace = await workspaceFactory.create()
    const item = await itemFactory.create({
      workspaceId: workspace.id,
      type: 'folder',
    })

    const data = {
      id: item.id,
      workspaceId: workspace.id,
      content: Buffer.from('hello word'),
    }

    await expect(useCase.execute(data)).rejects.toThrow(
      new Error('content is only allowed for type file')
    )
  })
})
