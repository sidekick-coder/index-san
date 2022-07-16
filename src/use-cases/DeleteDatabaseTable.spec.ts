import { test } from '@japa/runner'
import InMemoryDatabaseTableRepository from 'Repositories/implementations/InMemoyDatabaseTableRepository'
import { DatabaseTableFactory } from 'Tests/factories'
import DeleteDatabaseTable from './DeleteDatabaseTable'

test.group('DeleteDatabaseTable (unit)', (group) => {
  group.tap((t) => t.tags(['database-table']))

  const repository = new InMemoryDatabaseTableRepository()
  const factory = new DatabaseTableFactory(repository)
  const useCase = new DeleteDatabaseTable(repository)

  test('should return all database tables', async ({ expect }) => {
    const table = await factory.create()

    await useCase.execute({ id: table.id })

    expect(repository.items.length).toBe(0)
  })
})
