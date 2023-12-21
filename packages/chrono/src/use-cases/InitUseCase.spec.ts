import { test, expect } from 'vitest';
import InitUseCase from './InitUseCase';
import InMemoryDrive from '../__tests__/InMemoryDrive';

const drive = new InMemoryDrive();
const useCase = new InitUseCase(drive);

test('should init a workspace', async () => {
    await useCase.execute();

    const folders = [
        drive.resolve('.chrono'),
        drive.resolve('.chrono', 'objects'),
        drive.resolve('.chrono', 'blobs'),
    ];

    expect(drive.entries).toEqual([
        { type: 'directory', path: folders[0] },
        { type: 'directory', path: folders[1] },
        { type: 'directory', path: folders[2] },
    ])
});