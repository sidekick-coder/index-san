import { test } from '@japa/runner'
import { ItemFactory, WorkspaceFactory, MetadataFactory } from 'Tests/factories'
import InMemoryItemsRepository from 'Repositories/implementations/InMemoryItemsRepository'
import InMemoryMetadataRepository from 'Repositories/implementations/InMemoryMetadataRepository'
import InMemoryWorkspacesRepository from 'Repositories/implementations/InMemoryWorkspacesRepository'
import SaveItemMetadata from './save-item-metadata'

test.group('use-case: save-item-metadata', () => {
  const workspacesRepository = new InMemoryWorkspacesRepository()
  const itemsRepository = new InMemoryItemsRepository(workspacesRepository)
  const metadataRepository = new InMemoryMetadataRepository()

  const workspaceFactory = new WorkspaceFactory(workspacesRepository)
  const itemFactory = new ItemFactory(itemsRepository)

  const saveItemMetadata = new SaveItemMetadata(metadataRepository)

  test('should save item-metadata', async ({ expect }) => {
    const workspace = await workspaceFactory.create()
    const item = await itemFactory.create({
      workspaceId: workspace.id,
    })

    await saveItemMetadata.execute({
      workspaceId: workspace.id,
      itemId: item.id,
      data: { key: 'value' },
    })

    const metadata = await metadataRepository.findOne({
      where: { workspaceId: workspace.id, itemId: [item.id] },
    })

    expect(metadata?.key).toEqual('value')
  })
})
