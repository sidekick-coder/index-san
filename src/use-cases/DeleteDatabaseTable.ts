import IDatabaseTableRepository from 'Repositories/IDatabaseTableRepository'

interface Params {
  id: string
}

export default class CreateDatabaseTable {
  constructor(private readonly repository: IDatabaseTableRepository) {}

  async execute({ id }: Params): Promise<void> {
    await this.repository.delete(id)
  }
}
