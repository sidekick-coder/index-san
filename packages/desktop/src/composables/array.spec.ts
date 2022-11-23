import { test, describe, expect } from 'vitest'
import { ISArray } from './array'
import moment from 'moment'

describe('array.ts', () => {
    const data = Array.from({ length: 10 }).map((_, index) => ({
        name: `item-${index}`,
        amount: index,
        date: moment('2022-01-01')
            .add(index - 1, 'days')
            .format('YYYY-MM-DD'),
    }))

    test.each([
        ['amount < 1', [data[0]]],
        ['amount == 3', [data[3]]],
        ['10 - 1 == amount', [data[9]]],
    ])('show filter %s return items %j', (input, output) => {
        const items = new ISArray(data)

        const result = items.filter(input)

        expect(result.value).toEqual(output)
    })

    test.each([
        ['name == item-0', [data[0]]],
        ['name match .-9', [data[9]]],
        ['name match item-*', data],
        ['name includes 0', [data[0]]],
    ])('show filter string %s return items %j', (input, output) => {
        const items = new ISArray(data)

        const result = items.filter(input)

        expect(result.value).toEqual(output)
    })

    test.each([
        ['date > 2022-01-08', [data[9]]],
        ['date < 2022-01-02', [data[0], data[1]]],
        ['date < 2022-02-01', data],
    ])('show filter date %s return items %j', (input, output) => {
        const items = new ISArray(data)

        const result = items.filter(input)

        expect(result.value).toEqual(output)
    })

    test('show map items by pattern', () => {
        const items = new ISArray(data)

        const expected = data.map((i) => ({ ...i, amount: i.amount * 2 }))

        const result = items.map('amount * 2').value

        expect(result).toEqual(expected)
    })

    test('show transform amount field in positive numbers', () => {
        const data = [{ amount: -3.99 }, { amount: -5.99 }, { amount: -6.99 }]

        const items = new ISArray([{ amount: -3.99 }, { amount: -5.99 }, { amount: -6.99 }])

        const expected = data.map((i) => ({ ...i, amount: i.amount * -1 }))

        const result = items.map('amount * -1').value

        expect(result).toEqual(expected)
    })

    test('show add field array', () => {
        const data = [{ amount: -3.99 }, { amount: -5.99 }, { amount: -6.99 }]

        const items = new ISArray([{ amount: -3.99 }, { amount: -5.99 }, { amount: -6.99 }])

        const expected = data.map((i) => ({ ...i, type: i.amount < 0 ? 'outcome' : 'income' }))

        const result = items.map('type amount < 0 ? "outcome" : "income" ').value

        expect(result).toEqual(expected)
    })
})
