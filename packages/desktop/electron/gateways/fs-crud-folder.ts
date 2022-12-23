import DirectoryEntry from '../../../core/entities/directory-entry'
import Item from '../../../core/entities/item'
import item from '../../../core/entities/item'
import { Crud } from '../../../core/gateways/crud-manager'
import { Drive } from '../../../core/gateways/drive-manager'
import orderBy from 'lodash/orderBy'

interface ItemMeta {
    id: string
    [props: string]: any
}

const lockedFiles = new Map<string, boolean>()

function waitFreeFile(filename: string, timeout = 3000) {
    const start = Date.now() + timeout

    if (!lockedFiles.has(filename)) {
        lockedFiles.set(filename, false)
        return
    }

    return new Promise<void>((resolve, reject) => {
        const interval = setInterval(() => {
            if (start <= Date.now()) {
                reject(new Error('Timeout'))
                clearInterval(interval)
            }

            if (!lockedFiles.get(filename)) {
                resolve()
                clearInterval(interval)
            }
        })
    })
}

export default class FolderCrud implements Crud {
    public drive: Drive

    private async getMetas(collectionPath: string) {
        const metasFilename = [collectionPath, '.is', 'metas.json'].join('/')

        const text = await this.drive.read(metasFilename)

        const json = text ? JSON.parse(text.toString()) : []

        return json as ItemMeta[]
    }

    private async setMetas(collectionPath: string, newMetas: ItemMeta[]) {
        const filename = [collectionPath, '.is', 'metas.json'].join('/')

        await waitFreeFile(filename)

        lockedFiles.set(filename, true)

        const buffer = Buffer.from(JSON.stringify(newMetas, undefined, 4))

        await this.drive.write(filename, buffer)

        lockedFiles.set(filename, false)
    }

    public async list(collectionPath: string): Promise<item[]> {
        let entries = await this.drive.list(collectionPath)
        const metas = await this.getMetas(collectionPath)
        const items: Item[] = []

        entries = entries.filter((e) => e.type === 'directory' && e.name !== '.is')

        for await (const entry of entries) {
            const data: any = {}

            const meta = metas.find((m) => m.id === entry.name)

            if (meta) {
                Object.assign(data, meta)
            }

            data._filename = DirectoryEntry.normalize(collectionPath, entry.name)

            items.push(new Item(data, entry.name))
        }

        return orderBy(items, '_createdAt')
    }

    public async findById(collectionPath: string, id: string): Promise<item | null> {
        const path = `${collectionPath}/${id}`

        const entry = await this.drive.get(path)

        if (!entry) return null

        const data: any = Object.assign({}, entry)

        const metas = await this.getMetas(collectionPath)

        const itemMeta = metas.find((m) => m.id === entry.name)

        Object.assign(data, itemMeta)

        return new Item(data, entry.name)
    }

    public async create(collectionPath: string, data: item): Promise<item> {
        const entry = DirectoryEntry.directory(collectionPath, data.id)
        const contentEntry = DirectoryEntry.file(collectionPath, data.id, 'content.md')

        await this.drive.mkdir(entry.path)
        await this.drive.write(contentEntry.path, Buffer.from(''))

        const metas = await this.getMetas(collectionPath)

        metas.push({
            ...data,
            id: data.id,
            _createdAt: Date.now(),
            _updatedAt: Date.now(),
        })

        await this.setMetas(collectionPath, metas)

        return data
    }

    public async updateById(collectionPath: string, itemId: string, payload: any): Promise<void> {
        const entry = DirectoryEntry.directory(collectionPath, itemId)

        const isValid = await this.drive.exists(entry.path)

        if (!isValid) return

        const metas = await this.getMetas(collectionPath)

        if (payload.id) {
            await this.drive.move(entry.path, [collectionPath, payload.id].join('/'))
        }

        const meta: any = metas.find((m) => m.id === itemId) || {}
        const metaIndex = metas.findIndex((m) => m.id === itemId)

        Object.keys(payload).forEach((key) => {
            meta[key] = payload[key]
        })

        meta.id = payload.id || itemId
        meta._updatedAt = Date.now()
        meta._createdAt = meta._createdAt || Date.now()

        if (metaIndex === -1) metas.push(meta)

        if (metaIndex !== -1) metas[metaIndex] = meta

        await this.setMetas(collectionPath, metas)
    }

    public async deleteById(collectionPath: string, itemId: string): Promise<void> {
        const entry = DirectoryEntry.directory(`${collectionPath}/${itemId}`)

        await this.drive.delete(entry.path)

        const metas = await this.getMetas(collectionPath)

        const index = metas.findIndex((m) => m.id === itemId)

        if (index !== -1) metas.splice(index, 1)

        await this.setMetas(collectionPath, metas)
    }
}
