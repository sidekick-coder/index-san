import { test } from '@japa/runner'
import InMemoryRowProvider from 'Providers/implementations/InMemoryRowProvider'
import InMemoryDatabaseTableRepository from 'Repositories/implementations/InMemoryDatabaseTableRepository'
import { DatabaseTableFactory } from 'Tests/factories'
import UpdateTableRow from './UpdateTableRow'

test.group('UpdateTableRow', () => {
  const repository = new InMemoryDatabaseTableRepository()
  const factory = new DatabaseTableFactory(repository)
  const provider = new InMemoryRowProvider()

  const useCase = new UpdateTableRow(repository, provider)

  test(' should update table row data', async ({ expect }) => {
    const table = await factory.create()

    provider.items.set(table.id, [{ id: '1', name: 'test' }])

    await useCase.execute({ id: '1', tableId: table.id, data: { name: 'test2' } })

    const items = await provider.use(table).index()

    expect(items).toEqual([{ id: '1', name: 'test2' }])
  })
})
