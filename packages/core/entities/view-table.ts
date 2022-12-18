import View, { ViewColumn } from './view'

export interface ViewTableColumn extends ViewColumn {
    width: number | string
}

export default class ViewTable extends View {
    public readonly component = 'table'
    public columns: ViewTableColumn[] = []
}
