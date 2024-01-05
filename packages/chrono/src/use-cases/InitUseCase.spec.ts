import { test, expect } from 'vitest'
import InitUseCase from './InitUseCase'
import InMemoryDrive from '../__tests__/InMemoryDrive'
import HelperService from '../services/HelperService'

const drive = new InMemoryDrive()
const useCase = new InitUseCase(drive)

test('should init a workspace', async () => {
    await useCase.execute()

    expect(drive.entries).toEqual([
        { type: 'directory', path: drive.resolve('.chrono') },
        { type: 'directory', path: drive.resolve('.chrono', 'objects') },
        { type: 'directory', path: drive.resolve('.chrono', 'blobs') },
        { type: 'file', path: drive.resolve('.chrono', 'head'), content: HelperService.encode('') },
        {
            type: 'file',
            path: drive.resolve('.chrono', 'index'),
            content: HelperService.encode('[]'),
        },
    ])
})
