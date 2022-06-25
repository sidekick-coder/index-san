import { test } from '@japa/runner'
import { WorkspaceFactory } from 'Tests/factories'
import { clean, createFile, createFolder, createManyFiles } from 'Tests/fixtures/filesystem'
import FsItemsRepository from './FSItemsRepository'
import FSWorkspacesRepository from './FSWorkspacesRepository'

test.group('FSItemsRepository', (group) => {
  group.tap((t) => t.tags(['unit', 'fs']))

  let workspaceRepository: FSWorkspacesRepository
  let repository: FsItemsRepository

  let workspaceFactory: WorkspaceFactory

  group.each.setup(async () => {
    const workspaceJson = await createFile('workspaces.json', JSON.stringify([]))

    workspaceRepository = new FSWorkspacesRepository(workspaceJson)
    repository = new FsItemsRepository(workspaceRepository)

    workspaceFactory = new WorkspaceFactory(workspaceRepository)

    return () => clean()
  })

  test('should return items of workspace', async ({ expect }) => {
    const workspace = await workspaceFactory.create({
      path: await createFolder('workspace1'),
    })

    await workspaceFactory.create({
      path: await createFolder('workspace2'),
    })

    await createManyFiles('/workspace1', 5)
    await createManyFiles('/workspace2', 5)

    const result = await repository.index({
      where: { workspaceId: workspace.id },
    })

    expect(result.length).toBe(5)
  })

  test('should return items filtered by parentId', async ({ expect }) => {
    const workspace = await workspaceFactory.create({
      path: await createFolder('workspace'),
    })

    await createManyFiles('/workspace/children', 5)

    const result = await repository.index({
      where: { parentId: '/children', workspaceId: workspace.id },
    })

    expect(result.length).toBe(5)
  })

  test('should read big quantity of files', async ({ expect }) => {
    const workspace = await workspaceFactory.create({
      path: await createFolder('workspace'),
    })

    const length = 10000

    await createManyFiles('/workspace', length)

    const result = await repository.index({
      where: { workspaceId: workspace.id },
    })

    expect(result).toHaveLength(length)
  }).timeout(20000)
})
