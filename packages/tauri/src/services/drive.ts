import {
    readDir,
    exists,
    readBinaryFile,
    renameFile,
    createDir,
    writeBinaryFile,
    removeDir,
    removeFile,
} from '@tauri-apps/api/fs'
import { sep } from '@tauri-apps/api/path'

import DirectoryEntry from '@index-san/core/entities/directory-entry'
import type Drive from '@index-san/core/gateways/drive/drive'

export default class FSDrive implements Drive {
    public config = {
        path: '',
    }

    public async isFolder(path: string) {
        return readDir(path)
            .then(() => true)
            .catch(() => false)
    }

    public resolve(args: string | string[], separator = sep) {
        args = Array.isArray(args) ? args : [args]

        return args
            .map((a) => a.split(/\\|\//))
            .reduce((all, a) => all.concat(a), [])
            .filter((a) => a !== '')
            .join(separator)
    }

    public async list(path: string): Promise<DirectoryEntry[]> {
        const systemPath = this.resolve([this.config.path, path])

        const isValid = await this.isFolder(systemPath)

        if (!isValid) return []

        const entries = await readDir(systemPath)

        return entries.map((e) => {
            const filename = this.resolve([path, e.name || ''], '/')

            if (e.children) {
                return DirectoryEntry.directory(filename)
            }

            return DirectoryEntry.file(filename)
        })
    }

    public async get(entryPath: string) {
        const systemPath = this.resolve([this.config.path, entryPath])

        const entryExists = await this.exists(entryPath)

        if (!entryExists) return null

        const isFolder = await this.isFolder(systemPath)

        if (isFolder) {
            return DirectoryEntry.directory(entryPath)
        }

        return DirectoryEntry.file(entryPath)
    }

    public async exists(path: string) {
        const systemPath = this.resolve([this.config.path, path])

        return exists(systemPath)
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

        await renameFile(systemPath.source, systemPath.target)
    }

    public async mkdir(entryPath: string) {
        const systemPath = this.resolve([this.config.path, entryPath])

        await createDir(systemPath, { recursive: true })

        return DirectoryEntry.directory(entryPath)
    }

    public async write(entryPath: string, content: Uint8Array) {
        const systemPath = this.resolve([this.config.path, entryPath])

        await writeBinaryFile(systemPath, content)
    }

    public async read(entryPath: string): Promise<Uint8Array | null> {
        const systemPath = this.resolve([this.config.path, entryPath])

        const isFolder = await this.isFolder(systemPath)

        if (isFolder) return null

        return readBinaryFile(systemPath).catch(() => null)
    }

    public async delete(path: string) {
        const systemPath = this.resolve([this.config.path, path])

        const isFolder = await this.isFolder(systemPath)

        if (isFolder) {
            return await removeDir(systemPath, { recursive: true })
        }

        return await removeFile(systemPath)
    }
}
