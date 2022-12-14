import Item from '@core/entities/item'

export interface FilterTextConfig {
    type: 'equal' | 'not-equal' | 'includes'
}

export interface Filter {
    column: string
    type: 'text'
    config: any
    value: string
}

export function filterText(value: string, filter: Filter) {
    const type: FilterTextConfig['type'] = filter.config.type

    if (type === 'equal') {
        return value === filter.value
    }

    if (type === 'not-equal') {
        return value !== filter.value
    }

    return false
}

export function filter(item: Item, filter: Filter) {
    const value = item[filter.column]

    return filterText(value, filter)
}
