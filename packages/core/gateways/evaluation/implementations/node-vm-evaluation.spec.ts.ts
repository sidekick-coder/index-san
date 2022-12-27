import { test } from '@japa/runner'
import NodeVMEvaluation from './node-vm-evaluation'

test.group('script-service (service)', () => {
    const service = new NodeVMEvaluation()

    test('should execute script and return result', async ({ expect }) => {
        const result = await service.evaluate('setResult(4)')

        expect(result.result).toBe(4)
    })

    test('should execute Promise script and set result', async ({ expect }) => {
        const result = await service.evaluate(`
            const main = () => Promise.resolve(4)

            setResult(await main())
        `)

        expect(result.result).toBe(4)
    })

    test('should execute script with scope', async ({ expect }) => {
        let data = {}

        const scope = {
            setData: (arg: any) => (data = arg),
        }

        await service.evaluate('setData([1,2,3])', scope)

        expect(data).toEqual([1, 2, 3])
    })

    test('should return error if have one', async ({ expect }) => {
        const result = await service.evaluate(`
            const main = () => Promise.reject('Error in script')

            setResult(await main())
        `)

        expect(result.error).toEqual('Error in script')
    })

    test('should execute script and return logs', async ({ expect }) => {
        const result = await service.evaluate(`
            console.log('Hello')
            console.log({ key: 123 })
            console.log([ { key: 'abc' } ])            
        `)

        expect(result.logs).toEqual(['Hello', '{ key: 123 }', "[ { key: 'abc' } ]"])
    })
})
