import { useNonReactive } from '@/composables/utils'
import pick from 'lodash/pick'

import { ViewColumn } from '@core/entities/view-common'
import Column from '@core/entities/column'

export function withView<T = ViewColumn>(columns: Column[], viewColumns: ViewColumn[] = []) {
    const result: any[] = useNonReactive(columns)

    result.forEach((c) => {
        const vColumn = viewColumns.find((vc) => vc.id === c.id)

        if (vColumn) {
            Object.assign(c, useNonReactive(vColumn))
        }
    })

    result.sort((a, b) => {
        const aIndex = viewColumns.findIndex((s) => s.id === a.id)
        const bIndex = viewColumns.findIndex((s) => s.id === b.id)

        if (aIndex === -1 || bIndex === -1) return 0

        return aIndex - bIndex
    })

    return result as (Column & T)[]
}

export function withOnlyView<T = ViewColumn>(columns: (Column & T)[]): T[] {
    if (!columns[0]) return []

    const cKeys = Object.keys(new Column({}))
    const keys = Object.keys(columns[0]).filter((k) => k === 'id' || !cKeys.includes(k))

    return useNonReactive(columns).map((c) => pick(c, keys)) as T[]
}
