import Item from 'Entities/Item'
import Workspace from 'Entities/Workspace'

export interface IDataViewColumnAction {
  name: 'open-path'
  icon: string
}

export interface IDataViewColumn {
  label: string
  field: string
  action?: IDataViewColumnAction
}

export interface UseCase<T = any> {
  (name: string, args?: any): Promise<T>
}

export interface IDataView {
  columns(): Promise<IDataViewColumn[]>
  index(): Promise<Record<string, any>>
}

export interface IDataViewConstructor {
  new (item: Item, workspace: Workspace, useCase: UseCase): IDataView
}
