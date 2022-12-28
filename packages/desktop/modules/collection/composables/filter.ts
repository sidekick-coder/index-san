import ExecuteScriptDTO from '@/../core/use-cases/execute-script/execute-script.dto'
import Item from '@core/entities/item'

import ViewCommon, { ViewFilter } from '@core/entities/view-common'
import Column, { ColumnType } from '@core/entities/column'
import View from '@/../core/entities/view'
import moment, { Moment } from 'moment'
import EvaluationOutput from '@/../core/entities/evaluation-output'

export const operations = {
    text: {
        '=': (a: string, b: string) => a === b,
        '!=': (a: string, b: string) => a != b,
        'includes': (a: string, b: string) => a.includes(b),
    },
    number: {
        '=': (a: number, b: number) => a === b,
        '!=': (a: number, b: number) => a != b,
        '>': (a: number, b: number) => a > b,
        '<': (a: number, b: number) => a < b,
        '>=': (a: number, b: number) => a >= b,
        '<=': (a: number, b: number) => a <= b,
    },
    relation: {
        '=': (a: any, b: any) => a === b,
        '!=': (a: any, b: any) => a != b,
    },
    select: {
        '=': (a: string, b: string) => a === b,
        '!=': (a: string, b: string) => a != b,
    },
    script: {
        '=': (a: EvaluationOutput, b: any) => a.result === b,
        '!=': (a: EvaluationOutput, b: any) => a.result != b,
    },
    date: {
        '=': (a: Moment, b: Moment) => a.isSame(b),
        '!=': (a: Moment, b: Moment) => !a.isSame(b),
        '>': (a: Moment, b: Moment) => a.isAfter(b),
        '<': (a: Moment, b: Moment) => a.isBefore(b),
        '>=': (a: Moment, b: Moment) => a.isSameOrAfter(b),
        '<=': (a: Moment, b: Moment) => a.isSameOrBefore(b),
    },
}

export function filterText(value: string, filter: ViewFilter) {
    const operation: keyof typeof operations.text = filter.config.operation

    const a = value
    const b = filter.value

    if (operations.text[operation]) {
        return operations.text[operation](a, b)
    }

    return false
}

export function filterNumber(value: string | number, filter: ViewFilter) {
    const operation: keyof typeof operations.number = filter.config.operation

    const a = Number(value)
    const b = Number(filter.value)

    if (isNaN(a) || isNaN(b)) return false

    if (operations.number[operation]) {
        return operations.number[operation](a, b)
    }

    return false
}

export function filterRelation(value: Item | null, filter: ViewFilter) {
    const operation: keyof typeof operations.relation = filter.config.operation

    const a = value ? value.id : null
    const b = filter.value

    if (operations.relation[operation]) {
        return operations.relation[operation](a, b)
    }

    return false
}

export function filterScript(value: EvaluationOutput | null, filter: ViewFilter) {
    const operation: keyof typeof operations.script = filter.config.operation

    if (!value) return false

    const a = value
    const b = filter.value

    if (operations.script[operation]) {
        return operations.script[operation](a, b)
    }

    return false
}

export function filterDate(value: string | null, filter: ViewFilter) {
    const operation: keyof typeof operations.date = filter.config.operation
    const format: keyof typeof operations.date = filter.config.format

    if (!value) return false

    const a = moment(value, format, true)
    const b = moment(filter.value, format, true)

    if (!a.isValid() || !b.isValid()) return false

    if (operations.date[operation]) {
        return operations.date[operation](a, b)
    }

    return false
}

export function filter(item: Item, filter: ViewFilter) {
    const value = item[filter.field]

    if (filter.value === undefined || filter.value === '') return true

    if (filter.type === 'date') {
        return filterDate(value, filter)
    }

    if (filter.type === 'number') {
        return filterNumber(value, filter)
    }

    if (filter.type === 'relation') {
        return filterRelation(value, filter)
    }

    if (filter.type === 'script') {
        return filterScript(value, filter)
    }

    return filterText(value, filter)
}

// create a payload base on view filters
export function createPayload(filters: ViewFilter[] = [], columns: Column[] = []) {
    const payload = {}

    const safeList = [
        ColumnType.text,
        ColumnType.select,
        ColumnType.number,
        ColumnType.link,
        ColumnType.date,
    ]

    filters.forEach((f) => {
        const column = columns.find((c) => c.id === f.columnId)

        if (!column || !column.type || !column.field) return

        if (safeList.includes(column.type)) {
            payload[column.field] = f.value
        }
    })

    return payload
}
