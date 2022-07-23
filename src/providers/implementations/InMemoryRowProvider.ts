import DatabaseTable from 'Entities/DatabaseTable'
import IRowProvider from 'Providers/IRowProvider'

export default class InMemoryRowProvider implements IRowProvider {
  private table: DatabaseTable
  public items = new Map<string, any>()

  public use(table: DatabaseTable) {
    this.table = table
    return this
  }

  public index() {
    return this.items.get(this.table.id)
  }

  public async update(id: string, data: any) {
    const items = this.items.get(this.table.id)

    const item = items.findIndex((i: any) => i.id === id)

    if (item === -1) return

    items[item] = { ...items[item], ...data }

    this.items.set(this.table.id, items)
  }
}
