import DatabaseTable from 'Entities/DatabaseTable'
import IDatabaseTableRepository from 'Repositories/IDatabaseTableRepository'

interface Params {
  id: string
  data: Partial<DatabaseTable>
}

export default class UpdateDatabaseTable {
  constructor(private readonly repository: IDatabaseTableRepository) {}

  public async execute({ id, data }: Params) {
    const table = await this.repository.find(id)

    if (!table) {
      throw new Error('Table not found')
    }

    return this.repository.update(id, data)
  }
}
