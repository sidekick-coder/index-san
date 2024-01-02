import { test, expect, describe, beforeEach } from 'vitest'
import InMemoryDrive from '../__tests__/InMemoryDrive'
import HelperService from '../services/HelperService'
import AddStageItemUseCase from './AddStageItemUseCase'
import InMemoryHash from '../__tests__/InMemoryHash'
import LocalObjectRepository from '../repositories/implementations/LocalObjectRepository'
import ChronoObject from '../entities/ChronoObject'
import LocalStageItemRepository from '../repositories/implementations/LocalStageItemRepository'
import LocalBlobRepository from '../repositories/implementations/LocalBlobRepository'

const drive = new InMemoryDrive()
const hash = new InMemoryHash()

const objectRepository = new LocalObjectRepository(drive, hash)
const blobRepository = new LocalBlobRepository(drive, hash)
const stageItemRepository = new LocalStageItemRepository(drive)

const useCase = new AddStageItemUseCase(
    drive,
    stageItemRepository,
    objectRepository,
    blobRepository
)

describe('AddStageItemUseCase', () => {
    beforeEach(() => {
        drive.clear()
    })

    test('should add file to stage items', async () => {
        await drive.write('message.md', HelperService.encode('Hello World!'))

        await useCase.execute({ path: 'message.md' })

        const stageItems = await stageItemRepository.findAll()

        const allPaths = stageItems.map((item) => item.path)

        expect(allPaths).toEqual(['message.md'])
    })

    test('should add directory to stage items', async () => {
        await drive.mkdir('src')

        await drive.write('src/message.md', HelperService.encode('Hello World!'))

        await useCase.execute({ path: 'src' })

        const stageItems = await stageItemRepository.findAll()

        const allPaths = stageItems.map((item) => item.path)

        expect(allPaths).toEqual(['src', 'src/message.md'])
    })
})
