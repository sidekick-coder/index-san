import path from 'path'
import fs from 'fs'
import DirectoryEntry from '../../../core/entities/directory-entry'
import { Drive } from '../../../core/gateways/drive-manager'

export default class FSDrive implements Drive {
    
    public config = {
        path: ''
    }

    public resolve(args: string | string[], separator = path.sep) {
        args = Array.isArray(args) ? args : [args]

        return args
            .map(a => a.split(/\\|\//))
            .reduce((all, a) => all.concat(a), [])
            .filter(a => a !== '')
            .join(separator)
    }

    public async list(path: string): Promise<DirectoryEntry[]> {
        
        const systemPath = this.resolve([this.config.path, path])

        const entries = await fs.promises.readdir(systemPath, { withFileTypes: true })
        
        return entries.map(e => {
            const filename = this.resolve([path, e.name], '/')
            
            if (e.isDirectory()) {
                return DirectoryEntry.directory(filename)
            }

            return DirectoryEntry.file(filename)
        })
    }
    
    public async get(path: string) {
        const systemPath = this.resolve([this.config.path, path])

        return await fs.promises
            .stat(systemPath)
            .then((e) => e.isDirectory() ? DirectoryEntry.directory(path) : DirectoryEntry.file(path))
            .catch(() => null)
    }

    public async exists (path: string) {
        const systemPath = this.resolve([this.config.path, path])
        
        return fs.promises.stat(systemPath).then(() => true).catch(() => false)
    }

    public async create(entry: DirectoryEntry, content?: Buffer): Promise<DirectoryEntry> {
        const systemPath = this.resolve([this.config.path, entry.path])

        if (entry.type === 'directory') {
            await fs.promises.mkdir(systemPath, { recursive: true })

            return entry
        }

        await fs.promises.writeFile(systemPath, content || '')

        return entry
    }
    
    public async update(path: string, newPath: string, newContent?: Buffer): Promise<void> {
        throw new Error('not implemented')
    }   
    
    public async delete (path: string) {
        const systemPath = this.resolve([this.config.path, path])

        await fs.promises.rm(systemPath, { recursive: true })
    }
    
    public async read (path: string): Promise<Buffer | null> {
        throw new Error('not implemented')
        // return this.content.get(path) ?? null
    }
}