import { test } from '@japa/runner'
import { MetadataFactory, WorkspaceFactory } from 'Tests/factories'
import { clean, createFile, createFolder, createManyFiles } from 'Tests/fixtures/filesystem'
import { readFileIfExist } from 'Utils/filesystem'
import FSMetasRepository from './FSMetasRepository'
import FSWorkspacesRepository from './FSWorkspacesRepository'

test.group('FSMetasRepository', (group) => {
  let workspacesRepository: FSWorkspacesRepository
  let repository: FSMetasRepository

  let workspaceFactory: WorkspaceFactory

  group.tap((t) => t.tags(['unit', 'fs']))

  group.each.setup(async () => {
    const workspaceJson = await createFile('workspace.json', JSON.stringify([]))

    workspacesRepository = new FSWorkspacesRepository(workspaceJson)
    repository = new FSMetasRepository(workspacesRepository)

    workspaceFactory = new WorkspaceFactory(workspacesRepository)

    return () => clean()
  })

  test('should return list of a metas', async ({ expect }) => {
    await workspaceFactory.create({
      path: await createFolder('workspace'),
    })

    await createFile('workspace/.metas/_root_.yml', 'displayName: workspace-root')
    await createFile('workspace/deep-1/.metas/_root_.yml', 'displayName: deep-1-root')
    await createFile('workspace/deep-1/.metas/index.md.yml', 'displayName: index.md name')

    const metas = await repository.index()

    expect(metas).toHaveLength(3)

    expect(metas[0].displayName).toBe('workspace-root')
    expect(metas[1].displayName).toBe('deep-1-root')
    expect(metas[2].displayName).toBe('index.md name')
  })

  test('should return list of a metas filtered by itemId', async ({ expect }) => {
    await workspaceFactory.create({
      path: await createFolder('workspace'),
    })

    await createFile('workspace/.metas/_root_.yml', 'displayName: workspace-root')
    await createFile('workspace/deep-1/.metas/_root_.yml', 'displayName: deep-1-root')
    await createFile('workspace/deep-1/.metas/index.md.yml', 'displayName: index.md name')

    const metas = await repository.index({
      where: { itemId: ['deep-1', 'deep-1/index.md'] },
    })

    expect(metas).toHaveLength(2)

    expect(metas[0].displayName).toBe('deep-1-root')
    expect(metas[1].displayName).toBe('index.md name')
  })

  test('should create a meta', async ({ expect }) => {
    const workspace = await workspaceFactory.create({
      path: await createFolder('workspace'),
    })

    const filename = await createFile('workspace/deep-1/index.md', '# Hello world')

    await repository.create({
      workspaceId: workspace.id,
      itemId: 'deep-1/index.md',
      displayName: 'My Hello world',
    })

    const content = await readFileIfExist(filename.replace('index.md', '.metas/index.md.yml'))

    expect(content).toBe('displayName: My Hello world\n')
  })

  test('should return a metadata by itemId', async ({ expect }) => {
    await workspaceFactory.create({
      path: await createFolder('workspace'),
    })

    await createFile('workspace/.metas/_root_.yml', 'displayName: workspace-root')
    await createFile('workspace/deep-1/.metas/_root_.yml', 'displayName: deep-1-root')
    await createFile('workspace/deep-1/.metas/index.md.yml', 'displayName: index.md name')

    const meta = await repository.findOne({
      where: {
        itemId: ['deep-1'],
      },
    })

    expect(meta).toBeDefined()

    expect(meta?.displayName).toBe('deep-1-root')
  })
})
