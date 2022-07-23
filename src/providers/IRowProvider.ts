import DatabaseTable from 'Entities/DatabaseTable'

export interface IRowService {
  index(table: DatabaseTable): Promise<any[]>
}

export default interface IRowProvider {
  use(table: DatabaseTable): this
  index(): Promise<any[]>
}
