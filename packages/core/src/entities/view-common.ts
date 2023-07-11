import Column from './column'
import View from './view'

export interface ViewFilter {
    columnId: string
    field: string
    type: Column['type']
    config: any
    value: string
}

export interface ViewColumn {
    id: string // link with column
    hide?: boolean
}

export interface ViewOrder {
    field?: string
    desc?: 'asc' | 'desc'
}

export default class ViewCommon extends View {
    public search = ''
    public limit?: number
    public filters: ViewFilter[] = []
    public columns: ViewColumn[] = []
    public orderBy: ViewOrder[] = []

    constructor(props?: Partial<ViewCommon>, id?: string) {
        super(props, id)

        this.limit = props?.limit
        this.search = props?.search || ''
        this.filters = props?.filters || []
        this.columns = props?.columns || []
        this.orderBy = props?.orderBy || []
    }
}
