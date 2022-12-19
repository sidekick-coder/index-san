import ViewCommon, { ViewColumn } from './view-common'

export interface ViewTableColumn extends ViewColumn {
    width: number | string
}

export default class ViewTable extends ViewCommon {
    public readonly component = 'table'
    public readonly enableFilters = true

    public columns: ViewTableColumn[] = []
}
