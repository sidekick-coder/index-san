import DatabaseTable from 'Entities/DatabaseTable'
import IDatabaseTableRepository from 'Repositories/IDatabaseTableRepository'

export default class CreateDatabaseTable {
  constructor(private readonly repository: IDatabaseTableRepository) {}

  async execute(payload: DatabaseTable): Promise<void> {
    await this.repository.create(payload)
  }
}
