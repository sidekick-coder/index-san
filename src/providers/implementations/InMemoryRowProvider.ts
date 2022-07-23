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
}
