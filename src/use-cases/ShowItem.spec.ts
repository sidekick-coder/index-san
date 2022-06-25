import { test } from '@japa/runner'
import ItemNotFound from 'Errors/ItemNotFound'
import InMemoryItemsRepository from 'Repositories/implementations/InMemoryItemsRepository'
import { ItemFactory, WorkspaceFactory } from 'Tests/factories'
import ShowItem from './ShowItem'

test.group('ShowItem (unit)', (group) => {
  const repository = new InMemoryItemsRepository()

  const workspaceFactory = new WorkspaceFactory(repository.workspacesRepository)
  const itemFactory = new ItemFactory(repository)

  const useCase = new ShowItem(repository)

  group.each.setup(() => (repository.items = []))

  test('should return item object', async ({ expect }) => {
    const workspace = await workspaceFactory.create()
    const item = await itemFactory.create({ workspaceId: workspace.id })

    const result = await useCase.execute({
      id: item.id,
      workspaceId: workspace.id,
    })

    expect(result).toEqual(item)
  })

  test('should return item file buffer', async ({ expect }) => {
    const workspace = await workspaceFactory.create()

    const item = await repository.create(
      itemFactory.make({ type: 'file', workspaceId: workspace.id }),
      Buffer.from('hello word')
    )

    const result = await useCase.execute({
      id: item.id,
      workspaceId: workspace.id,
      responseType: 'buffer',
    })

    expect(result).toEqual(Buffer.from('hello word'))
  })

  test('should throw an error when item is not found', async ({ expect }) => {
    await expect(useCase.execute({ id: '', workspaceId: '' })).rejects.toThrow(new ItemNotFound())
  })

  test('should throw an error when try use buffer with folders', async ({ expect }) => {
    const workspace = await workspaceFactory.create()

    const item = await repository.create(
      itemFactory.make({ type: 'folder', workspaceId: workspace.id })
    )

    const promise = () =>
      useCase.execute({
        id: item.id,
        workspaceId: workspace.id,
        responseType: 'buffer',
      })

    await expect(promise()).rejects.toThrow(new Error('buffer only allowed for files'))
  })
})
