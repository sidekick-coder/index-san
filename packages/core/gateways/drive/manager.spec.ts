import { test } from '@japa/runner'
import DirectoryEntry from '../../entities/directory-entry'
import InMemoryDrive from '../../__tests__/gateways/in-memory-drive'
import DriveManager from './manager'

test.group('drive-manager', () => {
    const localDrive = new InMemoryDrive()

    test('should instantiate with drives', async ({ expect }) => {
        const drives = {
            local: localDrive,
            another: localDrive,
        }

        const drive = new DriveManager(drives, 'local')

        expect(drive.listDrives()).toEqual(drives)
    })

    test('should use() change the current drive', async ({ expect }) => {
        const drives = {
            local: localDrive,
            another: localDrive,
        }

        const drive = new DriveManager(drives, 'local')

        drive.use('another')

        expect(drive.getCurrentDrive()).toEqual('another')
    })

    test('should config() set drive configuration', async ({ expect }) => {
        const drives = {
            local: localDrive,
            another: localDrive,
        }

        const drive = new DriveManager(drives, 'local')

        drive.config({ foo: 'bar' })

        expect(drive.getCurrentConfig()).toEqual({ foo: 'bar' })
    })

    test('should list() return a list of files', async ({ expect }) => {
        const entry = new DirectoryEntry({
            name: 'test.txt',
            path: 'test',
            type: 'file',
        })

        const local = new InMemoryDrive()

        local.list = async () => [entry]

        const drive = new DriveManager({ local }, 'local')

        const files = await drive.list('/')

        expect(files).toEqual([entry])
    })

    test('should set config during list() method and reset after', async ({ expect }) => {
        const entry = new DirectoryEntry({
            name: 'test.txt',
            path: 'test',
            type: 'file',
        })

        let config: Record<string, any> = {}

        const local = new InMemoryDrive()

        local.list = async function () {
            config = this.config

            return [entry]
        }

        const drive = new DriveManager({ local }, 'local')

        await drive.config({ foo: 'bar' }).list('/')

        expect(config).toEqual({ foo: 'bar' })

        expect(local.config).toEqual({})
    })

    test('should create a new file', async ({ expect }) => {
        const drive = new DriveManager({ local: localDrive }, 'local')

        const entry = DirectoryEntry.file('new-file.txt')

        await drive.write(entry.path, Buffer.from(''))

        expect(localDrive.entries[0]).toEqual(entry)
    })
})
