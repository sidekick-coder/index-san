import { pick } from 'lodash'

import Item from 'Entities/Item'
import Workspace from 'Entities/Workspace'
import { IDataView, IDataViewColumn, UseCase } from 'Providers/IDataView'
export default class FolderDataViewFake implements IDataView {
  constructor(public item: Item, public workspace: Workspace, public useCase: UseCase) {}

  public defaultColumns = []

  public async columns() {
    const columns: IDataViewColumn[] = this.item.metas?.head || []

    columns.push({
      label: '',
      field: '',
      action: {
        name: 'open-path',
        icon: 'eye',
      },
    })

    return columns
  }

  public async index() {
    const items: Item[] = await this.useCase('list-items', {
      workspaceId: this.workspace.id,
      filters: {
        parentPath: this.item.path,
      },
    })

    const keys = (this.item.metas?.head || []).map((head: any) => head.name)

    return items.map((item) => ({
      ...pick(item, keys),
      path: item.path,
      workspaceId: item.workspaceId,
    }))
  }
}
