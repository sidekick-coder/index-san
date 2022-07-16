import IDatabaseTableRepository from 'Repositories/IDatabaseTableRepository'

export default class ListDatabaseTables {
  constructor(private readonly repository: IDatabaseTableRepository) {}

  public async execute() {
    return this.repository.index()
  }
}
