import { test } from '@japa/runner'
import { createWorkspaceFactory } from 'Tests/factories/workspace'
import { createItemFactory } from 'Tests/factories/item'
import { createTestApp } from 'Tests/fixtures/app'
import OptionsController from './OptionsController'
import Workspace from 'App/models/workspace'
import { createContext } from 'Tests/fixtures/context'
import { writeFileIfNotExist } from 'Helpers/filesystem'
import Option from 'App/models/Option'

test.group('WorkspaceController (unit)', (group) => {
  let controller: OptionsController
  let app: Awaited<ReturnType<typeof createTestApp>>
  let workspace: Workspace

  const workspaceFactory = createWorkspaceFactory()

  group.each.setup(async () => {
    app = await createTestApp()
    controller = new OptionsController()

    workspace = await workspaceFactory.create('test-workspace')

    return async () => {
      await app.cleanup()
      await workspaceFactory.cleanup()
    }
  })

  test('should find option by workspace-name and file-path', async ({ expect }) => {
    const data = {
      displayName: 'test',
    }

    await writeFileIfNotExist(
      workspace.systemResolve('.index-san', 'options.json'),
      JSON.stringify([{ name: 'index.md', data }])
    )

    const option = await controller.show(
      createContext({
        params: { workspaceName: workspace.name, path: workspace.resolve('index.md') },
      })
    )

    expect(option).toEqual(data)
  })

  test('should update option by workspace-name and file-path', async ({ expect }) => {
    const data = {
      displayName: 'old',
    }

    const filename = workspace.systemResolve('.index-san', 'options.json')

    await writeFileIfNotExist(filename, JSON.stringify([{ name: 'index.md', data }]))

    await controller.update(
      createContext({
        params: { workspaceName: workspace.name, path: workspace.resolve('index.md') },
        data: { displayName: 'new' },
      })
    )

    const option = await Option.from(filename).find('index.md')

    expect(option.data).toEqual(data)
  })
})
