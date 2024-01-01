import { test, expect, describe } from 'vitest'
import InMemoryDrive from '../__tests__/InMemoryDrive'
import HelperService from '../services/HelperService'
import HashFileUseCase from './HashFileUseCase'
import InMemoryHash from '../__tests__/InMemoryHash'
import LocalObjectRepository from '../repositories/implementations/LocalObjectRepository'
import LocalBlobRepository from '../repositories/implementations/LocalBlobRepository'

const drive = new InMemoryDrive()
const hash = new InMemoryHash()
const objectRepository = new LocalObjectRepository(drive, hash)
const blobRepository = new LocalBlobRepository(drive, hash)

const useCase = new HashFileUseCase(drive, objectRepository, blobRepository)

describe('HashFileUseCase', () => {
    test('should save a file object', async () => {
        const messageContent = HelperService.encode('Hello World!')

        await drive.write('message.md', messageContent)

        const { objectHash } = await useCase.execute({ path: 'message.md' })

        const chronoObject = await objectRepository.find(objectHash)

        expect(chronoObject!.type).toEqual('blob')
        expect(chronoObject!.head.blobHash).toEqual(await hash.hash(messageContent))
    })

    test('should save a file blob', async () => {
        const messageContent = HelperService.encode('Hello World!')

        await drive.write('message.md', messageContent)

        const { objectHash } = await useCase.execute({ path: 'message.md' })

        const chronoObject = await objectRepository.find(objectHash)

        const blobContests = await blobRepository.find(chronoObject!.head.blobHash)

        expect(blobContests).toEqual(messageContent)
    })
})
