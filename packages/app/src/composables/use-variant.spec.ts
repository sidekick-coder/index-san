import { test, expect, describe } from 'vitest'

import { useVariant } from './use-variant'

describe('use-variant (unit)', () => {
    test('should return correct variation classes', () => {
        const props = { color: 'accent' }

        const variant = useVariant(props, 'color', {
            accent: 'bg-accent',
            info: 'bg-info',
        })

        expect(variant.classes).toBe('bg-accent')
    })

    test('should update variation classes', () => {
        const props = reactive({ color: 'accent' })

        const variant = useVariant(props, 'color', {
            accent: 'bg-accent',
            info: 'bg-info',
        })

        expect(variant.classes).toBe('bg-accent')

        props.color = 'info'

        expect(variant.classes).toBe('bg-info')
    })

    test('should be able to use function as variation', () => {
        const props = { color: 'accent' }

        const variant = useVariant(props, 'color', {
            accent: () => ({ classes: 'bg-accent', styles: 'color: var(--accent)' }),
        })

        expect(variant.classes).toBe('bg-accent')
        expect(variant.styles).toBe('color: var(--accent)')
    })

    test('should add shared classes between variations ', () => {
        const props = reactive({ color: 'accent' })

        const variant = useVariant(props, 'color', {
            _shared: 'border',
            accent: 'bg-accent',
            info: 'bg-info',
        })

        expect(variant.classes).toBe('border bg-accent')

        props.color = 'info'

        expect(variant.classes).toBe('border bg-info')
    })

    test('should add shared styles between variations ', () => {
        const props = reactive({ color: 'accent' })

        const variant = useVariant(props, 'color', {
            _shared: () => ({ styles: 'font-weight:bold;' }),
            accent: () => ({ styles: 'color: var(--accent);' }),
            info: () => ({ styles: 'color: var(--info);' }),
        })

        expect(variant.styles).toBe('font-weight:bold; color: var(--accent);')

        props.color = 'info'

        expect(variant.styles).toBe('font-weight:bold; color: var(--info);')
    })

    test('should use _empty classes when variation was not found ', () => {
        const props = reactive({ color: 'unknown' })

        const variant = useVariant(props, 'color', {
            _empty: 'text-gray',
        })

        expect(variant.classes).toBe('text-gray')
    })

    test('should use _empty styles when variation was not found ', () => {
        const props = reactive({ color: 'unknown' })

        const variant = useVariant(props, 'color', {
            _empty: () => ({ styles: 'color: grey' }),
        })

        expect(variant.styles).toBe('color: grey')
    })

    test('should update variations options', () => {
        const props = reactive({ color: 'accent' })

        const variant = useVariant(props, 'color', {
            _shared: 'border',
            accent: 'bg-accent',
            info: 'bg-info',
        })

        expect(variant.classes).toBe('border bg-accent')

        variant.setOptions({
            _shared: 'font-bold',
            accent: 'text-accent',
            info: 'text-info',
        })

        expect(variant.classes).toBe('font-bold text-accent')

        props.color = 'info'

        expect(variant.classes).toBe('font-bold text-info')
    })

    test('should use _shared & empty at same type options', () => {
        const props = reactive({ color: 'text-unknown' })

        const variant = useVariant(props, 'color', {
            _shared: 'border',
            _empty: (v) => ({ classes: v }),
        })

        expect(variant.classes).toBe('border text-unknown')
    })
})
