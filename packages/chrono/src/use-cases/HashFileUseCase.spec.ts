import { test, expect, describe } from 'vitest'
import InMemoryDrive from '../__tests__/InMemoryDrive'
import HelperService from '../services/HelperService'
import HashFileUseCase from './HashFileUseCase'
import InMemoryHash from '../__tests__/InMemoryHash'
import ObjectRepositoryImpl from '../repositories/ObjectRepositoryImpl'
import BlobRepositoryImpl from '../repositories/BlobRepositoryImpl'

const drive = new InMemoryDrive()
const hash = new InMemoryHash()
const objectRepository = new ObjectRepositoryImpl(drive, hash)
const blobRepository = new BlobRepositoryImpl(drive, hash)

const useCase = new HashFileUseCase(drive, objectRepository, blobRepository)

describe('HashFileUseCase', () => {
    test('should save a file object', async () => {
        await drive.write('message.md', HelperService.encode('Hello World!'))

        const { objectHash, blobHash } = await useCase.execute({ path: 'message.md' })

        const chronoObject = await objectRepository.find(objectHash)

        expect(chronoObject).toEqual({
            type: 'blob',
            blobHash,
        })
    })

    test('should save a file blob', async () => {
        const messageContent = HelperService.encode('Hello World!')

        await drive.write('message.md', messageContent)

        const { blobHash } = await useCase.execute({ path: 'message.md' })

        const blobContests = await blobRepository.find(blobHash)

        expect(blobContests).toEqual(messageContent)
    })
})
