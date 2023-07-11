import ViewCommon from './view-common'
import type { ViewColumn } from './view-common'

export interface ViewTableColumn extends ViewColumn {
    width: number | string
}

export default class ViewTable extends ViewCommon {
    public readonly component = 'table'
    public columns: ViewTableColumn[] = []

    constructor(props?: Partial<ViewTable>, id?: string) {
        super(props, id)

        this.columns = props?.columns ?? []
    }
}
