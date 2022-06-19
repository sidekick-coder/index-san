import { test } from '@japa/runner'
import { MetadataFactory, WorkspaceFactory } from 'Tests/factories'
import { clean, createFile, createFolder, createManyFiles } from 'Tests/fixtures/filesystem'
import FsItemsRepository from './FSItemsRepository'
import FSMetadataRepository from './FSMetasRepository'
import FSWorkspacesRepository from './FSWorkspacesRepository'

test.group('FSItemsRepository', (group) => {
  group.tap((t) => t.tags(['unit', 'fs']))

  let workspaceRepository: FSWorkspacesRepository
  let metasRepository: FSMetadataRepository
  let repository: FsItemsRepository

  let workspaceFactory: WorkspaceFactory
  let metasFactory: MetadataFactory

  group.each.setup(async () => {
    const workspaceJson = await createFile('workspaces.json', JSON.stringify([]))

    workspaceRepository = new FSWorkspacesRepository(workspaceJson)
    metasRepository = new FSMetadataRepository(workspaceRepository)
    repository = new FsItemsRepository(workspaceRepository, metasRepository)

    workspaceFactory = new WorkspaceFactory(workspaceRepository)
    metasFactory = new MetadataFactory(metasRepository)

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

  test('should items load metadata by default', async ({ expect }) => {
    const workspace = await workspaceFactory.create({
      path: await createFolder('workspace'),
    })

    await createFile('/workspace/test.txt')

    await metasFactory.create({
      itemId: '/test.txt',
      displayName: 'test.txt display name',
      workspaceId: workspace.id,
    })

    const [result] = await repository.index({
      where: { workspaceId: workspace.id },
    })

    expect(result.displayName).toBe('test.txt display name')
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

  test('should return items filtered by meta field value', async ({ expect }) => {
    const workspace = await workspaceFactory.create({
      path: await createFolder('workspace'),
    })

    await createManyFiles('/workspace', 5)

    await createFile('/workspace/test.txt')

    await metasFactory.create({
      itemId: '/test.txt',
      projectName: 'awesome-project',
      workspaceId: workspace.id,
    })

    const result = await repository.index({
      where: { projectName: 'awesome-project', workspaceId: workspace.id },
    })

    expect(result).toHaveLength(1)

    expect(result[0].projectName).toBe('awesome-project')
  })

  test('should read big quantity of files', async ({ expect }) => {
    const workspace = await workspaceFactory.create({
      path: await createFolder('workspace'),
    })

    const length = 10000

    await createManyFiles('/workspace', length / 2)
    await createManyFiles('/workspace/.metas', length / 2, {
      pattern: 'file-%1.txt.yml',
    })

    await createManyFiles('/workspace', length / 2, {
      pattern: 'returned-%1.txt',
    })

    await createManyFiles('/workspace/.metas', length / 2, {
      pattern: 'returned-%1.txt.yml',
      content: 'project: awesome-project',
    })

    const result = await repository.index({
      where: { workspaceId: workspace.id, project: 'awesome-project' },
    })

    expect(result).toHaveLength(length / 2)
  }).timeout(20000)
})
