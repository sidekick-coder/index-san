import { pick } from 'lodash'
import Item from 'Entities/Item'
import Workspace from 'Entities/Workspace'
import { IDataView, UseCase } from 'Providers/IDataView'

export default class FolderDataViewFake implements IDataView {
  constructor(public item: Item, public workspace: Workspace, public useCase: UseCase) {}

  public async head() {
    return this.item.metas.head || []
  }

  public async index() {
    const items: Item[] = await this.useCase('list-items', {
      workspaceId: this.workspace.id,
      filters: {
        parentPath: this.item.path,
      },
    })

    const keys = (this.item.metas.head || []).map((head: any) => head.name)

    return items.map((item) => pick(item, keys))
  }
}
