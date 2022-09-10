import fs from 'fs'
import path from 'path'

export default class JSONService<T = any> {
    public items: T[] = []

    constructor(public filename: string) {}

    public async  load() {
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
}