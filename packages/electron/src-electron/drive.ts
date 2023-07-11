import path from 'path'
import fs from 'fs'

import DirectoryEntry from '@index-san/core/entities/directory-entry'

import type Drive from '@index-san/core/gateways/drive/drive'
import DirectoryEntryAlreadyExists from '@index-san/core/exceptions/directory-entry-already-exists'

export default class FSDrive implements Drive {
    public config = {
        path: '',
    }

    private lockFiles: string[] = []

    public isUnlocked(path: string, timeout = 10000) {
        if (!this.lockFiles.includes(path)) return Promise.resolve()

        const now = Date.now()

        return new Promise<void>((resolve, reject) => {
            const interval = setInterval(() => {
                if (Date.now() > now + timeout) {
                    reject(new Error('timeout'))

                    clearInterval(interval)

                    return
                }

                if (!this.lockFiles.includes(path)) {
                    resolve()

                    clearInterval(interval)

                    return
                }
            })
        })
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

        const isValid = await fs.promises
            .stat(systemPath)
            .then((s) => s.isDirectory())
            .catch(() => false)

        if (!isValid) return []

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
            throw new DirectoryEntryAlreadyExists(systemPath.target)
        }

        await fs.promises.rename(systemPath.source, systemPath.target)
    }

    public async copy(source: string, target: string) {
        const systemPath = {
            source: this.resolve([this.config.path, source]),
            target: this.resolve([this.config.path, target]),
        }

        await fs.promises.cp(systemPath.source, systemPath.target, { recursive: true })
    }

    public async mkdir(entryPath: string) {
        const systemPath = this.resolve([this.config.path, entryPath])

        await fs.promises.mkdir(systemPath, { recursive: true })

        return DirectoryEntry.directory(entryPath)
    }

    public async write(entryPath: string, content: Uint8Array) {
        await this.isUnlocked(entryPath)

        this.lockFiles.push(entryPath)

        const systemPath = this.resolve([this.config.path, entryPath])

        await fs.promises.mkdir(path.dirname(systemPath), { recursive: true })

        await fs.promises.writeFile(systemPath, content)

        this.lockFiles.splice(this.lockFiles.indexOf(entryPath), 1)
    }

    public async read(entryPath: string): Promise<Uint8Array | null> {
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
