import { test } from '@japa/runner'
import InMemoryDatabaseTableRepository from 'Repositories/implementations/InMemoyDatabaseTableRepository'
import { DatabaseTableFactory } from 'Tests/factories'
import ListDatabaseTables from './ListDatabaseTables'

test.group('ListDatabaseTables (unit)', (group) => {
  group.tap((t) => t.tags(['database-table']))

  const repository = new InMemoryDatabaseTableRepository()
  const factory = new DatabaseTableFactory(repository)
  const useCase = new ListDatabaseTables(repository)

  test('should return all database tables', async ({ expect }) => {
    await factory.createMany(undefined, 10)

    const result = await useCase.execute()

    expect(result.length).toBe(10)
  })
})
