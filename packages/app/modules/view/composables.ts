import orderBy from 'lodash/orderBy'

import Item from '@index-san/core/entities/item'
import View from '@index-san/core/entities/view'
import ViewCommon, { ViewColumn } from '@index-san/core/entities/view-common'

import { filter } from '@modules/collection/composables/filter'
import { useNonReactive } from '@composables/utils'
import Column from '@index-san/core/entities/column'

/**
 * Merge collection columns with view columns properties
 */
export function mergeWithViewColumns<T = ViewColumn>(
    columns: Column[] = [],
    viewColumns: ViewColumn[] = []
) {
    const result: any[] = useNonReactive(columns)

    for (const c of result) {
        const vColumn = viewColumns.find((vc) => vc.id === c.id)

        if (vColumn) {
            Object.assign(c, useNonReactive(vColumn))
        }
    }

    result.sort((a, b) => {
        const aIndex = viewColumns.findIndex((s) => s.id === a.id)
        const bIndex = viewColumns.findIndex((s) => s.id === b.id)

        if (aIndex === -1 || bIndex === -1) return 0

        return aIndex - bIndex
    })

    return result as (Column & T)[]
}

/**
 * Get column with only view properties
 */

export function pickViewColumn<T = ViewColumn>(column: Column & T) {
    const result: any = {}

    const cKeys = Object.keys(new Column({}))

    Object.keys(column)
        .filter((key) => key === 'id' || !cKeys.includes(key))
        .forEach((key) => {
            result[key] = column[key]
        })

    return result
}

/**
 * Get columns array with only view properties
 */
export function convertToViewColumns<T = ViewColumn>(columns: (Column & T)[]): T[] {
    return useNonReactive(columns).map(pickViewColumn) as T[]
}

/**
 * Filter items by view filters
 */
export function withViewFilters(items: Item[], view: ViewCommon) {
    return items.filter((item) =>
        view.filters.reduce(
            (valid, f) => valid && filter(item, f),
            !!JSON.stringify(item).toLowerCase().match(view.search.toLocaleLowerCase())
        )
    )
}

export function withViewOrder(items: Item[], view: ViewCommon) {
    if (!view.orderBy.length) {
        return items
    }

    return orderBy(
        items,
        view.orderBy.map((o) => o.field),
        view.orderBy.map((o) => (o.desc ? o.desc : 'asc'))
    )
}

function isCommon(view: View): view is ViewCommon {
    return ['table', 'gallery'].includes(view.component)
}

export function withViewIterations(items: Item[], view: View | null) {
    if (!view) return items

    if (isCommon(view)) {
        return [withViewFilters, withViewOrder].reduce((r, iteration) => iteration(r, view), items)
    }

    return items
}
