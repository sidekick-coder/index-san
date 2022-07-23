import { test } from '@japa/runner'
import InMemoryDatabaseTableRepository from 'Repositories/implementations/InMemoryDatabaseTableRepository'
import { DatabaseTableFactory } from 'Tests/factories'
import UpdateDatabaseTable from './UpdateDatabaseTable'

test.group('UpdateDatabaseTable (unit)', (group) => {
  group.tap((t) => t.tags(['database-table']))

  const repository = new InMemoryDatabaseTableRepository()
  const factory = new DatabaseTableFactory(repository)
  const useCase = new UpdateDatabaseTable(repository)

  test('should return all database tables', async ({ expect }) => {
    const table = await factory.create()

    await useCase.execute({ id: table.id, data: { name: 'new-name' } })

    const result = await repository.find(table.id)

    expect(result?.name).toBe('new-name')
  })
})
