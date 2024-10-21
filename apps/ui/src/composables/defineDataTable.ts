export type DataItem = Record<string, any>

export interface DataField<T = DataItem> {
    name?: string
    label?: string
    value?: string | ((row: T) => any)
    class?: string
    style?: any
}
export interface DataFilter {
    name: string
    type: string
    attrs?: Record<string, any>
}

export interface DataPagination {
    page: number
    total: number
    perPage: number
}

export function defineDataFields<T = DataItem>(payload: DataField<T>[]) {
    return payload
}

export function defineDataFilters(payload: DataFilter[]) {
    return payload
}
