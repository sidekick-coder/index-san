import { Query } from '@code-pieces/db-json'
import DatabaseTable from 'Entities/DatabaseTable'
import IDatabaseTableRepository from 'Repositories/IDatabaseTableRepository'
import { v4 as uuid } from 'uuid'

export default class FSDatabaseTableRepository implements IDatabaseTableRepository {
  constructor(private readonly filename: string) {}

  public query() {
    return Query.from<DatabaseTable[]>(this.filename)
  }

  public async create(table: DatabaseTable): Promise<DatabaseTable> {
    const id = uuid()

    await this.query().insert(table)

    table.id = id

    return table
  }

  public async index(): Promise<DatabaseTable[]> {
    return this.query()
  }

  public async find(id: string): Promise<DatabaseTable | null> {
    const [item] = await this.query().where('id', id)

    return item || null
  }

  public async update(id: string, table: Partial<DatabaseTable>): Promise<void> {
    await this.query().where('id', id).update(table)
  }

  public async delete(id: string): Promise<void> {
    await this.query().where('id', id).delete()
  }
}
