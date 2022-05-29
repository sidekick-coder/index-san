import Item from 'Entities/Item'
import Workspace from 'Entities/Workspace'

export interface IDataViewHead {
  name: string
  label: string
  field: string
}

export interface UseCase<T = any> {
  (name: string, args?: any): Promise<T>
}

export interface IDataView {
  head(): Promise<IDataViewHead[]>
  index(): Promise<Record<string, any>>
}

export interface IDataViewConstructor {
  new (item: Item, workspace: Workspace, useCase: UseCase): IDataView
}
