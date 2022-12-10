import { test } from '@japa/runner'
import ArrayService from './array-service'

test.group('array-service (service)', () => {
    test('should return items filtered', ({ expect }) => {
        const items = [
            { id: 1, name: 'item 01' },
            { id: 2, name: 'item 02' },
        ]

        const result = ArrayService.from(items).filter((i) => i.id == 2)

        expect(result.length).toBe(1)

        expect(result[0]).toEqual({ id: 2, name: 'item 02' })
    })

    test('should return sum of items amount', ({ expect }) => {
        const items = [
            { id: 1, amount: 5 },
            { id: 2, amount: 5 },
            { id: 3, amount: 5 },
            { id: 4, amount: 5 },
            { id: 5, amount: 5 },
            { id: 6, amount: 5 },
        ]

        const result = ArrayService.from(items).sumBy('amount')

        expect(result).toBe(items.length * 5)
    })

    test('should return items grouped by key', ({ expect }) => {
        const items = [
            { id: 1, tag: 'group-1' },
            { id: 2, tag: 'group-1' },
            { id: 3, tag: 'group-2' },
            { id: 4, tag: 'group-2' },
            { id: 5, tag: 'group-3' },
            { id: 6, tag: 'group-4' },
        ]

        const result = ArrayService.from(items).groupBy('tag')

        expect(result.length).toBe(4)

        expect(result.map((i) => i.tag)).toEqual(['group-1', 'group-2', 'group-3', 'group-4'])

        expect(result.map((i) => i._items.length)).toEqual([2, 2, 1, 1])
    })

    test('should sum grouped items', ({ expect }) => {
        const items = [
            { id: 1, tag: 'group-1', amount: 5 },
            { id: 2, tag: 'group-1', amount: 5 },
            { id: 3, tag: 'group-2', amount: 5 },
            { id: 4, tag: 'group-2', amount: 5 },
            { id: 5, tag: 'group-3', amount: 5 },
            { id: 6, tag: 'group-4', amount: 5 },
        ]

        const result = ArrayService.from(items).groupBy('tag').sumItemsBy('amount')

        expect(result.map((i) => i.amount)).toEqual([10, 10, 5, 5])
    })
})
