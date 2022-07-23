import DatabaseTable from 'Entities/DatabaseTable'
import IDatabaseTableRepository from 'Repositories/IDatabaseTableRepository'

export default class InMemoryDatabaseTableRepository implements IDatabaseTableRepository {
  public items: DatabaseTable[] = []

  public async create(table: DatabaseTable): Promise<DatabaseTable> {
    this.items.push(table)

    return table
  }

  public async index(): Promise<DatabaseTable[]> {
    return this.items
  }

  public async find(id: string): Promise<DatabaseTable | null> {
    const table = this.items.find((item) => item.id === id)

    return table || null
  }

  public async update(id: string, table: DatabaseTable): Promise<void> {
    const index = this.items.findIndex((item) => item.id === id)

    if (index === -1) {
      return
    }

    this.items[index] = {
      ...this.items[index],
      ...table,
      id,
    }
  }

  public async delete(id: string): Promise<void> {
    const index = this.items.findIndex((item) => item.id === id)

    if (index === -1) {
      return
    }

    this.items.splice(index, 1)
  }
}
