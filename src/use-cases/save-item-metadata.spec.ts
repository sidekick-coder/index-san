import { test } from '@japa/runner'
import ItemFactory from 'src/__tests__/factories/ItemFactory'
import WorkspaceFactory from 'src/__tests__/factories/WorkspaceFactory'
import InMemoryItemsRepository from 'TestRepositories/InMemoryItemsRepository'
import InMemoryMetadataRepository from 'TestRepositories/InMemoryMetadataRepository'
import InMemoryWorkspacesRepository from 'TestRepositories/InMemoryWorkspacesRepository'
import SaveItemMetadata from './save-item-metadata'

test.group('use-case: save-item-metadata', () => {
  const workspacesRepository = new InMemoryWorkspacesRepository()
  const itemsRepository = new InMemoryItemsRepository()
  const metadataRepository = new InMemoryMetadataRepository()

  const workspaceFactory = new WorkspaceFactory(workspacesRepository)
  const itemFactory = new ItemFactory(itemsRepository)

  const saveItemMetadata = new SaveItemMetadata(
    workspacesRepository,
    itemsRepository,
    metadataRepository
  )

  test('should save item-metadata', async ({ expect }) => {
    const workspace = await workspaceFactory.create()
    const item = await itemFactory.create(workspace)

    await saveItemMetadata.execute({
      workspaceId: workspace.id,
      path: item.path,
      data: { key: 'value' },
    })

    const metadata = await metadataRepository.metas.get(item.path)

    expect(metadata).toEqual({ key: 'value' })
  })
})
