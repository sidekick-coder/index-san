import IRowProvider from 'Providers/IRowProvider'
import IDatabaseTableRepository from 'Repositories/IDatabaseTableRepository'

interface Params {
  id: string
  tableId: string
  data: any
}

export default class UpdateTableRow {
  constructor(private repository: IDatabaseTableRepository, private provider: IRowProvider) {}

  public async execute({ tableId, id, data }: Params): Promise<any> {
    const table = await this.repository.find(tableId)

    if (!table) {
      throw new Error('Table  not found')
    }

    await this.provider.use(table).update(id, data)
  }
}
