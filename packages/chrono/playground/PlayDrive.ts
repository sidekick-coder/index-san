import IDrive from '../src/gateways/IDrive'
import path from 'path'
import fs from 'fs/promises'

export default class PlayDrive implements IDrive {
    public basePath = path.resolve(__dirname, '.data')

    public resolve(...paths: string[]) {
        return path.resolve(this.basePath, ...paths)
    }

    public async read(path: string) {
        return await fs.readFile(this.resolve(path))
    }

    public write(path: string, content: Uint8Array) {
        return fs.writeFile(this.resolve(path), content)
    }

    public async mkdir(path: string) {
        await fs.mkdir(this.resolve(path), {
            recursive: true,
        })
    }

    public async readdir(path: string) {
        return fs.readdir(this.resolve(path))
    }

    public async isFile(path: string) {
        return (await fs.stat(this.resolve(path))).isFile()
    }

    public async isDirectory(path: string) {
        return (await fs.stat(this.resolve(path))).isDirectory()
    }

    public async exists(path: string) {
        return fs
            .stat(this.resolve(path))
            .then(() => true)
            .catch(() => false)
    }
}