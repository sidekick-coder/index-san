import path from 'path'
import fs from 'fs'
import DirectoryEntry from '../../../core/entities/directory-entry'
import { Drive } from '../../../core/gateways/drive-manager'

export default class FSDrive implements Drive {
    public config = {
        path: '',
    }

    public resolve(args: string | string[], separator = path.sep) {
        args = Array.isArray(args) ? args : [args]

        return args
            .map((a) => a.split(/\\|\//))
            .reduce((all, a) => all.concat(a), [])
            .filter((a) => a !== '')
            .join(separator)
    }

    public async list(path: string): Promise<DirectoryEntry[]> {
        const systemPath = this.resolve([this.config.path, path])

        const entries = await fs.promises.readdir(systemPath, { withFileTypes: true })

        return entries.map((e) => {
            const filename = this.resolve([path, e.name], '/')

            if (e.isDirectory()) {
                return DirectoryEntry.directory(filename)
            }

            return DirectoryEntry.file(filename)
        })
    }

    public async get(entryPath: string) {
        const systemPath = this.resolve([this.config.path, entryPath])

        const exists = await this.exists(entryPath)

        if (!exists) return null

        return await fs.promises
            .stat(systemPath)
            .then((e) =>
                e.isDirectory()
                    ? DirectoryEntry.directory(entryPath)
                    : DirectoryEntry.file(entryPath)
            )
            .catch(() => null)
    }

    public async exists(path: string) {
        const systemPath = this.resolve([this.config.path, path])

        return fs.promises
            .stat(systemPath)
            .then(() => true)
            .catch(() => false)
    }

    public async move(source: string, target: string) {
        const systemPath = {
            source: this.resolve([this.config.path, source]),
            target: this.resolve([this.config.path, target]),
        }

        const targetExist = await this.exists(target)

        if (targetExist) {
            throw new Error('Target filename already exists')
        }

        await fs.promises.rename(systemPath.source, systemPath.target)
    }

    public async mkdir(entryPath: string) {
        const systemPath = this.resolve([this.config.path, entryPath])

        await fs.promises.mkdir(systemPath, { recursive: true })

        return DirectoryEntry.directory(entryPath)
    }

    public async write(entryPath: string, content: Buffer) {
        const systemPath = this.resolve([this.config.path, entryPath])

        await fs.promises.mkdir(path.dirname(systemPath), { recursive: true })

        await fs.promises.writeFile(systemPath, content)
    }

    public async read(entryPath: string): Promise<Buffer | null> {
        const systemPath = this.resolve([this.config.path, entryPath])

        const isFile = await fs.promises
            .stat(systemPath)
            .then((s) => s.isFile())
            .catch(() => false)

        if (!isFile) return null

        return await fs.promises.readFile(systemPath)
    }

    public async delete(path: string) {
        const systemPath = this.resolve([this.config.path, path])

        await fs.promises.rm(systemPath, { recursive: true })
    }
}
