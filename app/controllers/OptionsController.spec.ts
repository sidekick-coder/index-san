import { test } from '@japa/runner'
import { createWorkspaceFactory } from 'Tests/factories/workspace'
import { createTestApp } from 'Tests/fixtures/app'
import OptionsController from './OptionsController'
import Workspace from 'App/models/workspace'
import { createContext } from 'Tests/fixtures/context'
import { writeFileIfNotExist } from 'Helpers/filesystem'
import Option from 'App/models/Option'
import Sinon from 'sinon'

test.group('OptionsController (unit)', (group) => {
  let controller: OptionsController
  let app: Awaited<ReturnType<typeof createTestApp>>
  let workspace: Workspace

  const workspaceFactory = createWorkspaceFactory()

  group.setup(async () => {
    app = await createTestApp()
    controller = new OptionsController(app)

    workspace = await workspaceFactory.create('test-workspace')

    return async () => await workspaceFactory.cleanup()
  })

  test('should find option by workspace-name and file-path', async ({ expect }) => {
    const value = {
      displayName: 'test',
    }

    await writeFileIfNotExist(
      workspace.systemResolve('.index-san', 'options.json'),
      JSON.stringify([{ name: 'index.md', value }])
    )

    const option = await controller.show(
      createContext({
        params: { workspaceName: workspace.name, path: 'index.md' },
      })
    )

    expect(option).toEqual(value)
  })

  test('should update option by workspace-name and file-path', async ({ expect }) => {
    const value = {
      displayName: 'old',
    }

    const filename = workspace.systemResolve('.index-san', 'options.json')

    await writeFileIfNotExist(filename, JSON.stringify([{ name: 'index.md', value }]))

    await controller.update(
      createContext({
        params: { workspaceName: workspace.name, path: 'index.md' },
        data: { displayName: 'new' },
      })
    )

    const option = await Option.from<any>(filename).find('index.md')

    expect(option?.value).toEqual({ displayName: 'new' })
  })
})
