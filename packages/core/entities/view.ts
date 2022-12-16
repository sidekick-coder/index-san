import uuid from 'uuid-random'

export default class View {
    public id: string

    constructor(id?: string) {
        this.id = id ?? uuid()
    }
}

export interface ViewTableColumn {
    id: string // link with column
    width: number
}

export class ViewTable extends View {
    public component = 'table'
    public columns: ViewTableColumn[] = []
    public filters: any[] = []

    constructor(props: Omit<ViewTable, 'id'>, id?: string) {
        super(id)

        this.columns = props.columns
        this.filters = props.filters
    }
}
