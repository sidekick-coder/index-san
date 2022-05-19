import { test } from '@japa/runner'
import { createTestApp } from 'Tests/fixtures/app'
import { createWorkspaceFactory } from 'Tests/factories/workspace'
import { createItemFactory } from 'Tests/factories/item'

import { container } from 'tsyringe'
import ItemsController from './ItemsController'
import Workspace from 'App/models/Workspace'

test.group('ItemsController (unit)', (group) => {
  const itemFactory = createItemFactory()
  const workspaceFactory = createWorkspaceFactory()
  let app: Awaited<ReturnType<typeof createTestApp>>
  let controller: ItemsController
  let workspace: Workspace

  group.each.setup(async () => {
    app = await createTestApp()
    workspace = await workspaceFactory.create('test')
    controller = container.resolve(ItemsController)

    return async () => {
      await app.cleanup()
      await workspaceFactory.cleanup()
    }
  })

  test('should show return an item from workspace', async ({ expect }) => {
    const item = await itemFactory.create(workspace, 'my-item')

    const data = await controller.show({
      data: { workspace: workspace.name, path: 'my-item' },
    })

    expect(data).toEqual(item)
  })

  test('should show return an very deep item from workspace', async ({ expect }) => {
    const path = '/first-level/second-level/last-level'
    const item = await itemFactory.create(workspace, path)

    const data = await controller.show({
      data: { workspace: workspace.name, path },
    })

    expect(data).toEqual(item)
  })

  test('should return workspace as item when using /', async ({ expect }) => {
    const data = await controller.show({
      data: { workspace: workspace.name, path: '/' },
    })

    expect(data).toEqual({
      name: workspace.name,
      systemPath: workspace.systemResolve(),
      path: '/',
      workspace: workspace,
    })
  })

  test('should return item subitems', async ({ expect }) => {
    const item = await itemFactory.create(workspace, 'my-item')

    const [data] = await controller.showSubitems({
      data: { workspace: workspace.name, path: '/' },
    })

    expect(data).toEqual(item)
  })

  test('should return item files', async ({ expect }) => {
    const item = await itemFactory.create(workspace, 'my-item')

    const [data] = await controller.showFiles({
      data: { workspace: workspace.name, path: '/my-item' },
    })

    expect(data).toEqual({
      name: 'index.md',
      path: '/my-item/index.md',
      systemPath: workspace.systemResolve('/my-item/index.md'),
      workspace: workspace,
      item: item,
    })
  })

  test('should return item file option not exist', async ({ expect }) => {
    const item = await itemFactory.create(workspace, 'my-item')

    const option = {
      displayName: 'test',
    }

    await item.updateOption('index.md', option)

    const data = await controller.showOption({
      data: { workspaceName: workspace.name, itemPath: item.path, name: 'index.md' },
    })

    expect(data).toEqual(option)
  })

  test('should return empty if item file option not exist', async ({ expect }) => {
    const item = await itemFactory.create(workspace, 'my-item')

    const options = await controller.showOption({
      data: { workspaceName: workspace.name, itemPath: item.path, name: '/' },
    })

    expect(options).toEqual({})
  })

  test('should update an option of item', async ({ expect }) => {
    const item = await itemFactory.create(workspace, 'my-item')

    await item.updateOption('index.md', {
      displayName: 'old',
    })

    await controller.updateOption({
      data: {
        workspaceName: workspace.name,
        itemPath: item.path,
        name: 'index.md',
        data: {
          displayName: 'new',
        },
      },
    })

    const option = await item.findOption('index.md')

    expect(option).toEqual({ displayName: 'new' })
  })
})
