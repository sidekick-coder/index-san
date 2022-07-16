import Item from 'Entities/Item'
import Workspace from 'Entities/Workspace'
import { BaseFactory } from './BaseFactory'
import { v4 as uuid } from 'uuid'
import DatabaseTable from 'Entities/DatabaseTable'

export class WorkspaceFactory extends BaseFactory<Workspace> {
  public make(data?: Partial<Workspace> | undefined): Workspace {
    const name = data?.name ?? uuid()
    return new Workspace({
      name,
      displayName: name,
      path: `C:\\fake-path\\${name}`,
      ...data,
    })
  }
}

export class ItemFactory extends BaseFactory<Item> {
  public make(data?: Partial<Item> | undefined): Item {
    const id = uuid()
    return new Item({
      id,
      name: id,
      type: 'folder',
      filepath: `/${id}`,
      ...data,
    })
  }
}

export class DatabaseTableFactory extends BaseFactory<DatabaseTable> {
  public make(data?: Partial<DatabaseTable> | undefined): DatabaseTable {
    const id = uuid()
    return new DatabaseTable({
      id,
      name: id,
      type: 'folder',
      config: {},
      columns: [],
      ...data,
    })
  }
}
