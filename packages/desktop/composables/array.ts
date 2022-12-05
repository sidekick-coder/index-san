import _map from 'lodash/map'
import groupBy from 'lodash/groupBy'
import uniq from 'lodash/uniq'
import sumBy from 'lodash/sumBy'

import { evaluate } from 'mathjs'

import moment from 'moment'

export interface ArrayFilter {
    type: string
    key: string
    value: string | number
}

interface Iterator {
    type: 'filter' | 'map'
    options: any
}

export function useArray<T extends Array<any>>(source: T) {
    const iterations: Iterator[] = []

    function filterNumber(filterValue: ArrayFilter['value'], itemValue: string) {
        return String(filterValue)
            .split('|')
            .every((pattern) => {
                const number = Number(pattern.replace(/^\D+/g, ''))
                const operator = pattern.replace(String(number), '')

                let valid = true

                if (!operator.length) {
                    valid = Number(itemValue) === number
                }

                if (operator.includes('>')) {
                    valid = valid && Number(itemValue) > number
                }

                if (operator.includes('>=')) {
                    valid = valid && Number(itemValue) >= number
                }

                if (operator.includes('<')) {
                    valid = valid && Number(itemValue) < number
                }

                if (operator.includes('<=')) {
                    valid = valid && Number(itemValue) <= number
                }

                return valid
            })
    }

    function iterate(type: Iterator['type'], options: Iterator['options']) {
        iterations.push({ type, options })
    }

    function filter(...filters: ArrayFilter[]) {
        filters.forEach((f) => iterate('filter', f))

        return this
    }

    function map(...args: any[]) {
        args.forEach((a) => iterate('map', a))

        return this
    }

    function _filterItems(items: any[], filter: ArrayFilter) {
        return items.filter((item) => {
            if (filter.type === 'number') {
                return filterNumber(filter.value, item[filter.key])
            }

            return item[filter.key] === filter.value
        })
    }

    function value(): [string, string][] {
        let result = source.slice()

        iterations.forEach((i) => {
            if (i.type === 'filter') {
                result = _filterItems(result, i.options)
            }

            if (i.type === 'map') {
                result = _map(result, i.options)
            }
        })

        return result
    }

    return {
        filter,
        map,
        value,
    }
}

function isExpression(expression: string, scope: any) {
    try {
        evaluate(expression, scope)
        return true
    } catch (error) {
        return false
    }
}

function evaluateString(expression: string, scope: any = {}) {
    let result = expression

    Object.keys(scope).forEach((key) => {
        result = result.replaceAll(key, scope[key])
    })

    const [a, operator, b] = result.split(' ')

    const operations = {
        '>': () => a > b,
        '<': () => a < b,
        '<=': () => a <= b,
        '>=': () => a >= b,
        '==': () => a === b,
        'match': () => a.match(b),
        'includes': () => a.includes(b),
    }

    if (operations[operator]) {
        return operations[operator]()
    }

    return false
}

export class ISArray<T extends Object = any> {
    constructor(protected items: T[] = [], public isGrouped = false) {}

    public filter(pattern: string) {
        const result = this.items.filter((item) => {
            if (isExpression(pattern, item)) {
                return evaluate(pattern, item)
            }

            return evaluateString(pattern, item)
        })

        return new ISArray(result)
    }

    public map(pattern: string) {
        const [field, ...operator] = pattern.split(' ')

        const result = this.items.map((item) => {
            const data = { ...item }

            if (isExpression(pattern, item)) {
                data[field] = evaluate(pattern, data)
            }

            if (isExpression(operator.join(' '), data)) {
                data[field] = evaluate(operator.join(' '), data)
            }

            return data
        })

        return new ISArray(result)
    }

    public get(pattern: string) {
        const [field, ...operator] = pattern.split(' ')

        const result = this.items.map((item) => {
            const data = { ...item }

            if (isExpression(pattern, item)) {
                return evaluate(pattern, data)
            }

            if (isExpression(operator.join(' '), data)) {
                return evaluate(operator.join(' '), data)
            }

            return data[field]
        })

        return new ISArray(result)
    }

    public dateFormat(pattern: string) {
        const [field, from, to] = pattern.split(' ')

        const result = this.items.map((item) => {
            const data = { ...item }

            if (from && to) {
                data[field] = moment(data[field], from).format(to)
            }

            if (from) {
                data[field] = moment(data[field]).format(to)
            }

            return data
        })

        return new ISArray(result)
    }

    public uniqBy(key: string) {
        const result = uniq(this.items.map((item) => item[key]))

        return new ISArray(result)
    }

    public groupBy(key: string) {
        const results = Object.entries(groupBy(this.items, key)).map(([group, items]) => ({
            group,
            items,
        }))

        return new ISArray(results, true)
    }

    public sum(key: string) {
        if (!this.isGrouped) {
            return this.items
                .map((c: any) => c[key])
                .filter((n: any) => !isNaN(n))
                .map((n: string) => Number(n))
                .reduce((result: number, n: number) => result + n, 0)
        }

        const result = this.items.map(({ items }: any) => {
            const values = items
                .map((c: any) => c[key])
                .filter((n: any) => !isNaN(n))
                .map((n: string) => Number(n))
                .reduce((result: number, n: number) => result + n, 0)

            return values
        })

        return new ISArray(result)
    }

    public apply<T = ISArray>(rules: string[][]): T {
        return rules.reduce((result, [method, pattern]) => {
            if (method === 'filter') {
                return result.filter(pattern)
            }

            if (method === 'map') {
                return result.map(pattern)
            }

            if (method === 'dateFormat') {
                return result.dateFormat(pattern)
            }

            if (method === 'uniqBy') {
                return result.uniqBy(pattern)
            }

            if (method === 'groupBy') {
                return result.groupBy(pattern)
            }

            if (method === 'sum') {
                return result.sum(pattern)
            }

            if (method === 'get') {
                return result.get(pattern)
            }

            return result
        }, this) as T
    }

    public get value() {
        return this.items
    }
}
