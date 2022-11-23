import _map from 'lodash/map'
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

export class ISArray<T extends Object> {
    constructor(protected items: T[] = []) {}

    public filter(pattern: string) {
        this.items = this.items.filter((item) => {
            if (isExpression(pattern, item)) {
                return evaluate(pattern, item)
            }

            return evaluateString(pattern, item)
        })

        return this
    }

    public map(pattern: string) {
        const [field, ...operator] = pattern.split(' ')

        this.items = this.items.map((item) => {
            if (isExpression(pattern, item)) {
                item[field] = evaluate(pattern, item)
            }

            if (isExpression(operator.join(' '), item)) {
                item[field] = evaluate(operator.join(' '), item)
            }

            return item
        })

        return this
    }

    public get value() {
        return this.items
    }
}
