import { test } from '@japa/runner'
import InMemoryRowProvider from 'Providers/implementations/InMemoryRowProvider'
import InMemoryDatabaseTableRepository from 'Repositories/implementations/InMemoryDatabaseTableRepository'
import { DatabaseTableFactory } from 'Tests/factories'
import ListTableRows from './ListTableRows'

test.group('ListTableRows (unit)', () => {
  const repository = new InMemoryDatabaseTableRepository()
  const provider = new InMemoryRowProvider()
  const factory = new DatabaseTableFactory(repository)

  const useCase = new ListTableRows(repository, provider)

  test('should return table rows', async ({ expect }) => {
    const table = await factory.create()
    const item = { name: 'test' }

    provider.items.set(table.id, [item])

    const result = await useCase.execute({ tableId: table.id })

    expect(result).toEqual([item])
  })
})
