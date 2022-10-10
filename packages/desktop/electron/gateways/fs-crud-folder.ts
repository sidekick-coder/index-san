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

export default class FolderCrud implements Crud {
    public drive: Drive

    private async findMetas(collectionPath: string){
        const metasFilename = [collectionPath, '.is', 'metas.json'].join('/')

        const text = await this.drive.read(metasFilename)

        const json = text ? JSON.parse(text.toString()) : []

        return json as ItemMeta[]
    }
    
    private async updateMetas(collectionPath: string, newMetas: ItemMeta[]){
        const metasFilename = [collectionPath, '.is', 'metas.json'].join('/')

        await this.drive.write(
            metasFilename,
            Buffer.from(JSON.stringify(newMetas, undefined, 4))
        )
    }

    public async list(collectionPath: string): Promise<item[]> {
        let entries = await this.drive.list(collectionPath)
        const metas = await this.findMetas(collectionPath)
        const items: Item[] = []

        entries = entries.filter(e => e.type === 'directory' && e.name !== '.is')

        for await (const entry of entries) {
            const data: any = {
                _filename: entry.path,
            }

            const meta = metas.find(m => m.id === entry.name)

            if (meta) {
                Object.assign(data, meta)
            }
            
            items.push(new Item(data, entry.name))
        }

        return orderBy(items, '_createdAt')

        
    }
    
    public async findById(collectionPath: string, id: string): Promise<item | null> {
        const path = `${collectionPath}/${id}`

        const entry = await this.drive.get(path)

        if (!entry) return null

        const data: any = Object.assign({}, entry)

        const metas = await this.findMetas(collectionPath)
        
        const itemMeta = metas.find(m => m.id === entry.name)
        
        Object.assign(data, itemMeta)

        const content = await this.drive.read(path + '/content.json')

        if (content) {
            data._content = JSON.parse(content.toString())
        }

        return new Item(data, entry.name)
    }
    
    public async create(collectionPath: string, data: item): Promise<item> {

        const entry = DirectoryEntry.directory(collectionPath, data.id)
        const contentEntry = DirectoryEntry.file(collectionPath, data.id, 'content.json')
        
        await this.drive.mkdir(entry.path)
        await this.drive.write(contentEntry.path, Buffer.from('{}'))
        
        const metas = await this.findMetas(collectionPath)

        metas.push({
            ...data,
            id: data.id,
            _createdAt: Date.now(),
            _updateAt: Date.now()
        })

        await this.updateMetas(collectionPath, metas)

        return data
    }
    
    public async updateById(collectionPath: string, itemId: string, payload: any): Promise<void> {
        const entry = DirectoryEntry.directory(collectionPath, itemId)
        const { _content, ...data } = payload

        const isValid = await this.drive.exists(entry.path)

        if (!isValid) return

        const metas = await this.findMetas(collectionPath)

        if (_content) {
            await this.drive.write(entry.path + '/content.json', Buffer.from(JSON.stringify(_content)))
        }
        
        const oldMeta = metas.find(m => m.id === itemId)

        const newMeta = {
            ...oldMeta,
            ...data,
            id: itemId,
            _updateAt: Date.now()
        }
        
        const index = metas.findIndex(m => m.id === itemId)

        if (index === -1) metas.push(newMeta)

        if (index !== -1) metas[index] = newMeta

        await this.updateMetas(collectionPath, metas)        
    }
    
    public async deleteById(collectionPath: string, itemId: string): Promise<void> {
        const entry = DirectoryEntry.directory(`${collectionPath}/${itemId}`)

        await this.drive.delete(entry.path)

        const metas = await this.findMetas(collectionPath)

        const index = metas.findIndex(m => m.id === itemId)

        if (index !== -1) metas.splice(index, 1)        

        await this.updateMetas(collectionPath, metas)

    }

}