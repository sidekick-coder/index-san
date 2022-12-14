import { CollectionColumn } from '@core/entities/collection'
import Item from '@core/entities/item'

export interface FilterTextConfig {
    operation: '=' | '!=' | 'includes'
}

export interface FilterNumberConfig {
    operation: '=' | '!=' | '>' | '<' | '>=' | '<='
}

export interface Filter {
    column: string
    type: CollectionColumn['type']
    config: any
    value: string
}

export function filterText(value: string, filter: Filter) {
    const operation: FilterTextConfig['operation'] = filter.config.operation

    if (operation === '=') {
        return value === filter.value
    }

    if (operation === '!=') {
        return value !== filter.value
    }

    return false
}

export function filterNumber(value: string | number, filter: Filter) {
    const operation: FilterNumberConfig['operation'] = filter.config.operation

    const a = Number(value)
    const b = Number(filter.value)

    if (isNaN(a) || isNaN(b)) return false

    const operations: Record<FilterNumberConfig['operation'], () => boolean> = {
        '=': () => a === b,
        '!=': () => a != b,
        '>': () => a > b,
        '<': () => a > b,
        '>=': () => a >= b,
        '<=': () => a <= b,
    }

    if (operations[operation]) {
        return operations[operation]()
    }

    return false
}

export function filter(item: Item, filter: Filter) {
    const value = item[filter.column]

    if (filter.type === 'number') {
        return filterNumber(value, filter)
    }

    return filterText(value, filter)
}
