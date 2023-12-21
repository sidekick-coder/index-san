import { describe, test, expect, afterEach } from 'vitest'
import InMemoryDrive from '../__tests__/InMemoryDrive'
import ObjectService from './ObjectService'
import InMemoryHash from '../__tests__/InMemoryHash'
import ChronoObject from '../entities/ChronoObject'

const drive = new InMemoryDrive()
const hash = new InMemoryHash()
const service = new ObjectService(drive, hash)

describe('ChronoObject', () => {
    afterEach(() => {
        drive.clear()
    })

    test('should transform CronoObject in a hash string', async () => {
        const fileContent = `type: file\nblob_name: 123\nsize: 3\n`
        const bytes = new TextEncoder().encode(fileContent)

        const chronoObject = ChronoObject.fromBytes(bytes)
        const hashString = await hash.hash(bytes)

        const result = await service.hashObject(chronoObject)

        expect(result).toEqual(hashString)
    })

    test('should write a CronoObject', async () => {
        const chronoObject = ChronoObject.fromString('type: file\nblob_name: 123\nsize: 3\n')

        const { hash } = await service.writeObject(chronoObject)

        const entry = drive.entries[0]

        expect(entry.path).toEqual(`.chrono/objects/${hash}`)

        expect(entry.content).toEqual(chronoObject.toBytes())
    })
})
