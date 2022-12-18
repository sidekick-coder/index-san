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
}

export default class View {
    public id = ''
    public filters: ViewFilter[] = []
    public columns: ViewColumn[] = []

    constructor(props?: Omit<View, 'id'>, id?: string) {
        Object.assign(this, props)

        this.id = id || uuid()
    }

    public merge(payload: Partial<View>) {
        const { columns, ...data } = payload

        if (!columns) {
            return Object.assign(this, data)
        }

        columns.forEach((c) => {
            const cColumn = this.columns.find((cv) => cv.id === c.id)

            Object.assign(cColumn || {}, c)
        })

        this.columns.sort((a, b) => {
            const aIndex = columns.findIndex((s) => s.id === a.id)
            const bIndex = columns.findIndex((s) => s.id === b.id)

            if (aIndex === -1 || bIndex === -1) return 0

            return aIndex - bIndex
        })
    }
}
