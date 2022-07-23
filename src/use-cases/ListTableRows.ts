import ITableRow from 'Providers/IRowProvider'
import IDatabaseTableRepository from 'Repositories/IDatabaseTableRepository'

interface Params {
  tableId: string
}

export default class ShowTableRows {
  constructor(private tableRepository: IDatabaseTableRepository, private provider: ITableRow) {}

  public async execute({ tableId }: Params) {
    const table = await this.tableRepository.find(tableId)

    if (!table) {
      throw new Error('Table not found')
    }

    this.provider.use(table)

    return this.provider.index()
  }
}
