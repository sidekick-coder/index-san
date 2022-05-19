import { test } from '@japa/runner'
import { createWorkspaceFactory } from 'Tests/factories/workspace'
import { createTestApp } from 'Tests/fixtures/app'
import WorkspaceController from './WorkspaceController'

test.group('WorkspaceController (unit)', (group) => {
  const factory = createWorkspaceFactory()
  let controller: WorkspaceController
  let app: Awaited<ReturnType<typeof createTestApp>>

  group.each.setup(async () => {
    app = await createTestApp()
    controller = new WorkspaceController(app)

    return async () => {
      await app.cleanup()
      await factory.cleanup()
    }
  })

  test('should return a all workspaces', async ({ expect }) => {
    const workspaces = await factory.createMany(5)

    const data = await controller.index()

    expect(workspaces).toEqual(data)
  })

  test('should create a new workspace', async ({ expect }) => {
    const paths = ['path1', 'path2']

    app.electronStub.dialog.showOpenDialog.resolves({
      filePaths: paths,
    })

    await controller.store()

    const workspaces = await controller.index()

    expect(workspaces).toEqual([
      { name: 'path1', path: 'path1' },
      { name: 'path2', path: 'path2' },
    ])
  })

  test('should destroy a workspace', async ({ expect }) => {
    const workspace = await factory.create()

    await controller.destroy({ data: { path: workspace.name } })

    const workspaces = await controller.index()

    expect(workspaces).toEqual([])
  })
})
