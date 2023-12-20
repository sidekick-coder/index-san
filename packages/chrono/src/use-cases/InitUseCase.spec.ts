import { test, expect } from 'vitest';
import InitUseCase from './InitUseCase';
import InMemoryDrive from '../__tests__/InMemoryDrive';

const drive = new InMemoryDrive();
const useCase = new InitUseCase(drive);

test('should init a workspace', async () => {
    await useCase.execute({ path: 'test' });

    const folders = [
        drive.resolve('test', '.chrono'),
        drive.resolve('test', '.chrono', 'objects'),
    ];

    expect(drive.entries).toEqual([
        { type: 'directory', path: folders[0] },
        { type: 'directory', path: folders[1] },
    ])
});