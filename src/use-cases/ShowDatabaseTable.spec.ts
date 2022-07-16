import { test } from '@japa/runner'
import InMemoryDatabaseTableRepository from 'Repositories/implementations/InMemoyDatabaseTableRepository'
import { DatabaseTableFactory } from 'Tests/factories'
import ShowDatabaseTable from './ShowDatabaseTable'

test.group('ShowDatabaseTable (unit)', (group) => {
  group.tap((t) => t.tags(['database-table']))

  const repository = new InMemoryDatabaseTableRepository()
  const factory = new DatabaseTableFactory(repository)
  const useCase = new ShowDatabaseTable(repository)

  test('should return all database tables', async ({ expect }) => {
    const table = await factory.create()

    const result = await useCase.execute({ id: table.id })

    expect(result).toEqual(table)
  })
})
