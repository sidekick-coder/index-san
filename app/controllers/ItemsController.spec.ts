import { test } from '@japa/runner'
import { createTestApp } from 'Tests/fixtures/app'
import { createWorkspaceFactory } from 'Tests/factories/workspace'
import { createItemFactory } from 'Tests/factories/item'

import { container } from 'tsyringe'
import ItemsController from './ItemsController'
import Workspace from 'App/models/Workspace'
import { createContext } from 'Tests/fixtures/context'

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

    const data = await controller.show(
      createContext({
        data: { workspace: workspace.name, path: 'my-item' },
      })
    )

    expect(data).toEqual(item)
  })

  test('should show return an very deep item from workspace', async ({ expect }) => {
    const path = '/first-level/second-level/last-level'
    const item = await itemFactory.create(workspace, path)

    const data = await controller.show(
      createContext({
        data: { workspace: workspace.name, path },
      })
    )

    expect(data).toEqual(item)
  })

  test('should return workspace as item when using /', async ({ expect }) => {
    const data = await controller.show(
      createContext({
        data: { workspace: workspace.name, path: '/' },
      })
    )

    expect(data).toEqual({
      name: workspace.name,
      systemPath: workspace.systemResolve(),
      path: '/',
      workspace: workspace,
    })
  })

  test('should return item subitems', async ({ expect }) => {
    const item = await itemFactory.create(workspace, 'my-item')

    const [data] = await controller.showSubitems(
      createContext({
        data: { workspace: workspace.name, path: '/' },
      })
    )

    expect(data).toEqual(item)
  })

  test('should return item files', async ({ expect }) => {
    const item = await itemFactory.create(workspace, 'my-item')

    const [data] = await controller.showFiles(
      createContext({
        data: { workspace: workspace.name, path: '/my-item' },
      })
    )

    expect(data).toEqual({
      name: 'index.md',
      path: 'my-item/index.md',
      systemPath: workspace.systemResolve('/my-item/index.md'),
      workspace: workspace,
      item: item,
    })
  })
})
