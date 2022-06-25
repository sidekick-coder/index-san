import Item from 'Entities/Item'
import Metadata from 'Entities/Metadata'
import Workspace from 'Entities/Workspace'
import { BaseFactory } from './BaseFactory'
import { v4 as uuid } from 'uuid'

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
      workspaceId: uuid(),
      ...data,
    })
  }
}

export class MetadataFactory extends BaseFactory<Metadata> {}
