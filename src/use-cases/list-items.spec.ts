import { test } from '@japa/runner'
import ItemFactory from 'src/__tests__/factories/ItemFactory'
import WorkspaceFactory from 'src/__tests__/factories/WorkspaceFactory'
import InMemoryItemsRepository from 'TestRepositories/InMemoryItemsRepository'
import InMemoryMetadataRepository from 'TestRepositories/InMemoryMetadataRepository'
import InMemoryWorkspacesRepository from 'TestRepositories/InMemoryWorkspacesRepository'

import ListItems from './list-items'

test.group('use-case: list-items', () => {
  const workspaceRepository = new InMemoryWorkspacesRepository()
  const itemRepository = new InMemoryItemsRepository()
  const metadataRepository = new InMemoryMetadataRepository()

  const workspaceFactory = new WorkspaceFactory(workspaceRepository)
  const itemFactory = new ItemFactory(itemRepository)

  const listItems = new ListItems(workspaceRepository, itemRepository, metadataRepository)

  test('should list all items in a workspace', async ({ expect }) => {
    const workspace = await workspaceFactory.create()
    const items = await itemFactory.createMany(workspace)

    const result = await listItems.execute({
      workspaceId: workspace.id,
    })

    expect(result).toEqual(items)
  })

  test('should return items with metadata', async ({ expect }) => {
    const workspace = await workspaceFactory.create()
    const items = await itemFactory.createMany(workspace)

    metadataRepository.metas.set(items[0].path, {
      displayName: 'foo',
    })

    const [result] = await listItems.execute({
      workspaceId: workspace.id,
    })

    expect(result.metas).toEqual({ displayName: 'foo' })
  })

  test('should filter items by parent path', async ({ expect }) => {
    const workspace = await workspaceFactory.create()
    const parent = await itemFactory.create(workspace, { name: 'parent' })
    const child = await itemFactory.create(workspace, {
      name: 'child',
      path: parent.path + '/child',
    })

    const result = await listItems.execute({
      workspaceId: workspace.id,
      filters: {
        parentPath: parent.path,
      },
    })

    expect(result).toHaveLength(1)

    expect(result).toEqual([child])
  })

  test('should load item belongs to relation', async ({ expect }) => {
    const workspace = await workspaceFactory.create()

    const project = await itemFactory.create(workspace, {
      name: 'project-01',
      path: '/projects/project-01',
    })

    const task = await itemFactory.create(workspace, {
      name: 'task-01',
      path: '/tasks/task-01',
    })

    metadataRepository.metas.set(task.path, {
      relations: [
        {
          name: 'project',
          type: 'belongs-to',
          where: { path: '/projects/project-01' },
        },
      ],
    })

    const [result] = await listItems.execute({
      workspaceId: workspace.id,
      relations: ['project'],
      filters: {
        parentPath: '/tasks',
      },
    })

    expect(result.project).toEqual(project)
  })

  test('should load item has many relation', async ({ expect }) => {
    const workspace = await workspaceFactory.create()

    const project = await itemFactory.create(workspace, {
      name: 'project-01',
      path: '/projects/project-01',
    })

    await itemFactory.createMany(workspace, {
      name: 'task-%i',
      path: '/tasks/task-%i',
    })

    const task = await itemFactory.create(workspace, {
      name: 'task-01',
      path: '/tasks/task-01',
    })

    metadataRepository.metas.set(task.path, {
      project: project.path,
    })

    metadataRepository.metas.set(project.path, {
      relations: [
        {
          name: 'tasks',
          type: 'has-many',
          where: { parent_path: '/tasks', project: '/projects/project-01' },
        },
      ],
    })

    const [result] = await listItems.execute({
      workspaceId: workspace.id,
      relations: ['tasks'],
      filters: {
        parentPath: '/projects',
      },
    })

    expect(result.tasks).toHaveLength(1)

    expect(result.tasks).toEqual([task])
  })
})
