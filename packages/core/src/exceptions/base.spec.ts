import { test } from '@japa/runner'

import BaseException from './base'

test.group('base exception (unit)', () => {
    test('should have common format', ({ expect }) => {
        const error = new BaseException('Hello word')

        expect(error.message).toBe('Hello word')
        expect(error.i18nKey).toBe('errors.internal')
        expect(error.i18nArgs).toEqual([])
    })
})
