import IDatabaseTableRepository from 'Repositories/IDatabaseTableRepository'

interface Params {
  id: string
}
export default class ShowDatabaseTable {
  constructor(private readonly repository: IDatabaseTableRepository) {}

  public async execute({ id }: Params) {
    const table = await this.repository.find(id)

    if (!table) {
      throw new Error('Table not found')
    }

    return table
  }
}
