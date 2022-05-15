import { test } from '@japa/runner'
import { createTestApp } from 'Tests/fixtures/app'
import { createWorkspaceFactory } from 'Tests/factories/workspace'
import { createItemFactory } from 'Tests/factories/item'

import { container } from 'tsyringe'
import ItemsController from './ItemsController'
import Workspace from 'App/models/Workspace'

test.group('ItemsController', (group) => {
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
    const item = await itemFactory.create(workspace, 'first-level/second-level/last-level')

    const data = await controller.show({
      data: { workspace: workspace.name, path: 'first-level/second-level/last-level' },
    })

    expect(data).toEqual(item)
  })
})
