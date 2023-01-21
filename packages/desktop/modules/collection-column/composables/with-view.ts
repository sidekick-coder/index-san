import { useNonReactive } from '@composables/utils'

import { ViewColumn } from '@core/entities/view-common'
import Column from '@core/entities/column'

export function withView<T = ViewColumn>(columns: Column[], viewColumns: ViewColumn[] = []) {
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

export function withNonColumnProperties<T = ViewColumn>(column: Column & T) {
    const result: any = {}

    const cKeys = Object.keys(new Column({}))

    Object.keys(column)
        .filter((key) => key === 'id' || !cKeys.includes(key))
        .forEach((key) => {
            result[key] = column[key]
        })

    return result
}

export function withOnlyView<T = ViewColumn>(columns: (Column & T)[]): T[] {
    return useNonReactive(columns).map(withNonColumnProperties) as T[]
}
