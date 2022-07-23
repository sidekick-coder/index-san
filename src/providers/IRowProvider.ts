import DatabaseTable from 'Entities/DatabaseTable'

export interface IRowService {
  index(table: DatabaseTable): Promise<any[]>
}

export default interface IRowProvider {
  use(table: DatabaseTable): this
  index(): Promise<any[]>
  // create(data: any): Promise<any>
  update(id: string, data: any): Promise<any>
  // delete(id: string): Promise<any>
}
