import uuid from 'uuid-random'
import Column from './column'

export interface ViewFilter {
    columnId: string
    field: string
    type: Column['type']
    config: any
    value: string
}

export interface ViewColumn extends Partial<Column> {
    id: string // link with column
    hide?: boolean
}

export default class View {
    public id = ''
    public filters: ViewFilter[] = []
    public columns: ViewColumn[] = []

    constructor(props?: Partial<View>, id?: string) {
        Object.assign(this, props)

        this.id = id || uuid()
    }
}
