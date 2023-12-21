import { test, expect, describe } from 'vitest'
import InMemoryDrive from '../__tests__/InMemoryDrive'
import HelperService from '../services/HelperService'
import CatFileUseCase from './CatFileUseCase'
import InMemoryHash from '../__tests__/InMemoryHash'
import ObjectRepositoryImpl from '../repositories/ObjectRepositoryImpl'
import ChronoObject from '../entities/ChronoObject'

const drive = new InMemoryDrive()
const hash = new InMemoryHash()
const objectRepository = new ObjectRepositoryImpl(drive, hash)

const useCase = new CatFileUseCase(objectRepository)

describe('CatFileUseCase', () => {
    test('should return chrono object', async () => {
        await drive.write('message.md', HelperService.encode('Hello World!'))

        const { objectHash } = await objectRepository.save(
            new ChronoObject({
                type: 'blob',
                blobHash: '123',
            })
        )

        const result = await useCase.execute({ objectHash })

        expect(result).toEqual({
            type: 'blob',
            blobHash: '123',
        })
    })
})
