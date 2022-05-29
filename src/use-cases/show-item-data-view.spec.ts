import { test } from '@japa/runner'
import ItemFactory from 'src/__tests__/factories/ItemFactory'
import WorkspaceFactory from 'src/__tests__/factories/WorkspaceFactory'
import FolderDataViewFake from 'src/__tests__/providers/FolderDataViewFake'
import InMemoryItemsRepository from 'TestRepositories/InMemoryItemsRepository'
import InMemoryMetadataRepository from 'TestRepositories/InMemoryMetadataRepository'
import InMemoryWorkspacesRepository from 'TestRepositories/InMemoryWorkspacesRepository'
import ShowItemDataView from './show-item-data-view'

test.group('use-case: show-item-data-view', () => {
  const workspacesRepository = new InMemoryWorkspacesRepository()
  const itemsRepository = new InMemoryItemsRepository()
  const metadataRepository = new InMemoryMetadataRepository()

  const workspaceFactory = new WorkspaceFactory(workspacesRepository)
  const itemFactory = new ItemFactory(itemsRepository)

  const showItemDataView = new ShowItemDataView(
    workspacesRepository,
    itemsRepository,
    metadataRepository,
    FolderDataViewFake
  )

  test('should return item data-view head and items', async ({ expect }) => {
    const workspace = await workspaceFactory.create()
    const item = await itemFactory.create(workspace, {
      name: 'parent',
    })

    const head = [
      {
        name: 'name',
        label: 'Name',
      },
      {
        name: 'path',
        label: 'Path',
      },
    ]

    const subitems = await itemFactory.createMany(workspace, {
      path: `${item.path}/child-%i`,
      name: 'child-%i',
    })

    const items = subitems.map((item) => ({ name: item.name, path: item.path }))

    metadataRepository.metas.set(item.path, { head })

    const result = await showItemDataView.execute({
      workspaceId: workspace.id,
      path: item.path,
    })

    expect(result).toEqual({ head, items })
  })
})
