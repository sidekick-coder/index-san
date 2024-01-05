import { test, expect, describe } from 'vitest'
import InMemoryDrive from '../__tests__/InMemoryDrive'
import HelperService from '../services/HelperService'
import CatFileUseCase from './CatFileUseCase'
import InMemoryHash from '../__tests__/InMemoryHash'
import ObjectRepositoryImpl from '../repositories/implementations/LocalObjectRepository'
import ChronoObject from '../entities/ChronoObject'

const drive = new InMemoryDrive()
const hash = new InMemoryHash()
const objectRepository = new ObjectRepositoryImpl(drive, hash)

const useCase = new CatFileUseCase(objectRepository)

describe('CatFileUseCase', () => {
    test('should return chrono object', async () => {
        await drive.write('message.md', HelperService.encode('Hello World!'))

        const { objectHash } = await objectRepository.save(
            ChronoObject.fromObject({
                type: 'blob',
                blobHash: '123',
            })
        )

        const result = await useCase.execute({ objectHash })

        expect(result.type).toEqual('blob')
        expect(result.head.blobHash).toEqual('123')
    })
})
