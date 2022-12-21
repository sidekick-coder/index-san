import Column from './column'
import View from './view'

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

export default class ViewCommon extends View {
    public search = ''
    public filters: ViewFilter[] = []
    public columns: ViewColumn[] = []
}
