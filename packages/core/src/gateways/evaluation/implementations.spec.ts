import { test } from '@japa/runner'
import IEvaluationService from './evaluation'
import DefaultEvaluation from './implementations/default-evaluation'
import NodeVMEvaluation from './implementations/node-vm-evaluation'

interface Services {
    name: string
    service: IEvaluationService
}

test.group('evaluation (unit)', () => {
    const services: Services[] = [
        { name: 'default', service: new DefaultEvaluation() },
        { name: 'node-vm', service: new NodeVMEvaluation() },
    ]

    test('should "{name}" execute script and return result ')
        .with(services)
        .run(async ({ expect }, { service }) => {
            const result = await service.evaluate('setResult(4)')

            expect(result.result).toBe(4)
        })

    test('should "{name}" execute Promise script and set result')
        .with(services)
        .run(async ({ expect }, { service }) => {
            const result = await service.evaluate(`
            const main = () => Promise.resolve(4)

            setResult(await main())
        `)

            expect(result.result).toBe(4)
        })

    test('should "{name}" execute script with scope')
        .with(services)
        .run(async ({ expect }, { service }) => {
            let data = {}

            const scope = {
                setData: (arg: any) => (data = arg),
            }

            await service.evaluate('setData([1,2,3])', scope)

            expect(data).toEqual([1, 2, 3])
        })

    test('should "{name}" return error if have one')
        .with(services)
        .run(async ({ expect }, { service }) => {
            const result = await service.evaluate(`
            const main = () => Promise.reject('Error in script')

            setResult(await main())
        `)

            expect(result.error).toEqual('Error in script')
        })

    test('should "{name}" execute script and return logs')
        .with(services)
        .run(async ({ expect }, { service }) => {
            const result = await service.evaluate(`
            console.log('Hello')
            console.log({ key: 123 })
            console.log([ { key: 'abc' } ])            
        `)

            expect(result.logs).toEqual([
                'Hello',
                JSON.stringify({ key: 123 }, null, 4),
                JSON.stringify([{ key: 'abc' }], null, 4),
            ])
        })

    test('should "{name}" not be able to use import')
        .with(services)
        .run(async ({ expect }, { service }) => {
            const result = await service.evaluate(`import fs from 'fs'`)

            expect(result.error.message).toBe('Cannot use import statement outside a module')
        })

    test('should "{name}" not be able to use require')
        .with(services)
        .run(async ({ expect }, { service }) => {
            const result = await service.evaluate(`const fs = require('fs')`)

            expect(result.error.message).toBe('require is not defined')
        })
})
