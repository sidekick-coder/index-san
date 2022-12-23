import ViewCommon, { ViewColumn } from './view-common'

export interface ViewTableColumn extends ViewColumn {
    width: number | string
}

export default class ViewTable extends ViewCommon {
    public readonly component = 'table'
    public columns: ViewTableColumn[] = []

    constructor(props?: Partial<ViewTable>, id?: string) {
        super(props, id)

        if (props?.columns) {
            this.columns = props.columns
        }
    }
}
