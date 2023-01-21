import orderBy from 'lodash/orderBy'

import Item from '@core/entities/item'
import View from '@core/entities/view'
import ViewCommon from '@core/entities/view-common'

import { filter } from '@modules/collection/composables/filter'

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
