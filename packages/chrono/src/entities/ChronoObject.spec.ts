import { describe, test, expect } from 'vitest';
import ChronoObject from './ChronoObject';

describe('ChronoObject', () => {

    test('should throw an error if type is missing', () => {
        const fileContent = `blob_name: 123\nsize: 3\n`
        const bytes = new TextEncoder().encode(fileContent)
    
        expect(() => ChronoObject.fromBytes(bytes)).toThrow('Missing type')
    });

    test('should transform bytes in CronoObject', async () => {
    
        const fileContent = `type: file\nblob_name: 123\nsize: 3\n`
        const bytes = new TextEncoder().encode(fileContent)
    
        const chronoObject = ChronoObject.fromBytes(bytes)
    
        expect(chronoObject).toEqual({
            blobName: '123',
            size: '3',
            type: 'file',
        })
    });
})
