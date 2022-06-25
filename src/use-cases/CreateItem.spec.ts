import { test } from '@japa/runner'
import InMemoryItemsRepository from 'Repositories/implementations/InMemoryItemsRepository'
import { WorkspaceFactory } from 'Tests/factories'
import CreateItem from './CreateItem'

test.group('CreateItem (unit)', (group) => {
  const repository = new InMemoryItemsRepository()

  const workspaceFactory = new WorkspaceFactory(repository.workspacesRepository)

  const useCase = new CreateItem(repository)

  group.each.setup(() => (repository.items = []))

  test('should create a folder', async ({ expect }) => {
    const workspace = await workspaceFactory.create()

    const data = {
      id: '/new-item',
      name: 'new-item',
      workspaceId: workspace.id,
      type: 'folder',
    }

    await useCase.execute(data)

    const item = repository.items[0]

    expect(item).toEqual(data)
  })

  test('should create a file', async ({ expect }) => {
    const workspace = await workspaceFactory.create()

    const data = {
      id: '/new-item',
      name: 'new-item',
      workspaceId: workspace.id,
      type: 'file',
      content: Buffer.from('zzz'),
    }

    await useCase.execute(data)

    const item = repository.items[0]

    expect(item).toEqual(data)
  })

  test('should throw an error when use invalid type', async ({ expect }) => {
    const workspace = await workspaceFactory.create()

    const data = {
      id: '/new-item',
      name: 'new-item',
      workspaceId: workspace.id,
      type: 'invalid',
    }

    await expect(useCase.execute(data)).rejects.toThrow(new Error('invalid type'))
  })

  test('should throw an error when try create a folder with content', async ({ expect }) => {
    const workspace = await workspaceFactory.create()

    const data = {
      id: '/new-item',
      name: 'new-item',
      workspaceId: workspace.id,
      type: 'folder',
      content: Buffer.from('hello word'),
    }

    await expect(useCase.execute(data)).rejects.toThrow(
      new Error('content is only allowed for type file')
    )
  })
})
