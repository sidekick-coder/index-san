export interface TabItem {
    label: string
    value: string
    order?: number
    [key: string]: any
}

export function defineTabItems<T extends TabItem>(items: T[]) {
    return items
}
