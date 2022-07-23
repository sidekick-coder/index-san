import { test } from '@japa/runner'
import InMemoryDatabaseTableRepository from 'Repositories/implementations/InMemoryDatabaseTableRepository'
import { DatabaseTableFactory } from 'Tests/factories'
import CreateDatabaseTable from './CreateDatabaseTable'

test.group('CreateDatabaseTable (unit)', (group) => {
  group.tap((t) => t.tags(['database-table']))

  const repository = new InMemoryDatabaseTableRepository()
  const factory = new DatabaseTableFactory(repository)

  const useCase = new CreateDatabaseTable(repository)

  test('should create a new database table', async ({ expect }) => {
    const payload = factory.make()

    await useCase.execute(payload)

    expect(repository.items.length).toBe(1)
  })
})
