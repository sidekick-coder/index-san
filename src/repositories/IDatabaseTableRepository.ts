import DatabaseTable from 'Entities/DatabaseTable'

export default interface IDatabaseTableRepository {
  create(table: Omit<DatabaseTable, 'id'>): Promise<DatabaseTable>
  index(): Promise<DatabaseTable[]>
  find(id: string): Promise<DatabaseTable | null>
  update(id: string, table: Partial<DatabaseTable>): Promise<void>
  delete(id: string): Promise<void>
}
