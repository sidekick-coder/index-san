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
        const exists = await fs.promises
            .stat(this.tmpdir)
            .then(() => true)
            .catch(() => false)

        if (exists) {
            fs.rmSync(this.tmpdir, { recursive: true, force: true })
        }

        await new Promise((resolve) => setTimeout(resolve, 100))


        await fs.promises.mkdir(this.tmpdir, { recursive: true })
    }

    public async createDir(filename: string) {
        const systemPath = this.resolve(this.tmpdir, filename)

        await fs.promises.mkdir(systemPath, { recursive: true })
    }

    public async createFile(filename: string, content = '') {
        const systemPath = this.resolve(this.tmpdir, filename)

        await fs.promises.writeFile(systemPath, content)
    }

    public async createManyFiles(length = 5, filename = 'item-') {
        const items = Array.from({ length }).map((_, i) => [filename, i].join(''))

        await Promise.all(items.map((i) => this.createFile(i)))
    }
    
    public async createManyDir(length = 5, filename = 'item-') {
        const items = Array.from({ length }).map((_, i) => [filename, i].join(''))

        await Promise.all(items.map((i) => this.createDir(i)))
    }

    public async exists(filename: string, type?: 'file' | 'directory'){
        const stats = await fs.promises
            .stat(this.resolve(this.tmpdir, filename))
            .then((e) => e)
            .catch(() => null)
            
        if (!stats || !type) {
            return !!stats
        }

        return type === 'file' ? stats.isFile() : stats.isDirectory()
    }
}