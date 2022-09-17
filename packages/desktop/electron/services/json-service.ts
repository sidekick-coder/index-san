import fs from 'fs'
import path from 'path'

export default class JSONService<T = Record<string, string>> {
    public items: T[] = []

    constructor(public filename: string) {}

    public async  load() {
        this.items = []
        
        const exists = await fs.promises
            .stat(this.filename)
            .then(() => true)
            .catch(() => false)

        if (!exists) {
            await fs.promises.mkdir(path.dirname(this.filename), { recursive: true })
            await fs.promises.writeFile(this.filename, JSON.stringify([]))
            return
        }

        const text = await fs.promises.readFile(this.filename, 'utf-8')

        this.items = JSON.parse(text)
    }

    public async save(){
        await fs.promises.writeFile(this.filename, JSON.stringify(this.items))
    }

    public findBy(key: string, value: string) {
        const item = this.items.find(i => i[key] === value)

        return item ?? null
    }
    
    public updateOrCreateBy(key: string, data: any) {
        const index = this.items.findIndex(i => i[key] === data[key])

        if (index !== -1) this.items[index] = data

        if (index === -1) this.items.push(data)
    }
}