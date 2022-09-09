import path from 'path'
import fs from 'fs'

export default class TestFS {
    
    constructor(
        public tmpdir = path.resolve(__dirname, '..', '..', 'tmp', 'tests')
    ){
        fs.mkdirSync(tmpdir, { recursive: true })
    }

    public resolve(...args: string[]) {        
        return args
            .map(a => a.split(/\\|\//))
            .reduce((all, a) => all.concat(a), [])
            .filter(a => a !== '')
            .join(path.sep)
    }

    public async clear(){
        await fs.promises.rm(this.tmpdir, {recursive: true})

        await fs.promises.mkdir(this.tmpdir, { recursive: true })
    }

    public async createDir(filename: string) {
        const systemPath = this.resolve(this.tmpdir, filename)

        await fs.promises.mkdir(systemPath, { recursive: true })
    }

    public async createFile(filename: string) {
        const systemPath = this.resolve(this.tmpdir, filename)

        await fs.promises.writeFile(systemPath, '')
    }

    public async createManyFiles(length = 5, prefix = 'item-') {
        const items = Array.from({ length }).map((_, i) => [prefix,i].join(''))

        await Promise.all(items.map((i) => this.createFile(i)))
    }

    public async exists(filename: string, type?: 'file' | 'directory'){
        const stats = await fs.promises
            .stat(this.resolve(this.tmpdir, filename))
            .then((e) => e)
            .catch(() => null)

        if (!type) {
            return !!stats
        }

        return type === 'file' ? stats?.isFile() : stats?.isDirectory()
    }
}