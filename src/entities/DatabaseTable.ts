export interface IDatabaseTableColumn {
  name: string
}

export default class DatabaseTable {
  public id: string
  public name: string
  public type: 'folder'
  public columns: IDatabaseTableColumn[]
  public config: any = {}

  constructor(data: DatabaseTable) {
    Object.assign(this, data)
  }

  public static mount(data: DatabaseTable) {
    return new DatabaseTable(data)
  }
}
