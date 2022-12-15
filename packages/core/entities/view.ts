import uuid from 'uuid-random'

import { CollectionColumn } from './collection'

export default class View {
    public id: string

    constructor(id?: string) {
        this.id = id ?? uuid()
    }
}

interface ViewTableColumn extends CollectionColumn {}

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
