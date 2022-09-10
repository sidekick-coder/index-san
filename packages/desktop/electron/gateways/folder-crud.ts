import DirectoryEntry from '../../../core/entities/directory-entry'
import Item from '../../../core/entities/item'
import item from '../../../core/entities/item'
import { Crud } from '../../../core/gateways/crud-manager'
import { Drive } from '../../../core/gateways/drive-manager'

interface ItemMeta {
    itemId: string
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
            Buffer.from(JSON.stringify(newMetas))
        )
    }

    public async list(collectionPath: string): Promise<item[]> {
        const entries = await this.drive.list(collectionPath)

        return entries
            .filter(e => e.type === 'directory')
            .map(entry => new Item(entry, entry.path))
    }
    
    public async findById(collectionPath: string, id: string): Promise<item | null> {
        const path = `${collectionPath}/${id}`

        const entry = await this.drive.get(path)

        if (!entry) return null

        const metas = await this.findMetas(collectionPath)

        const itemMeta = metas.find(m => m.itemId === entry.name)

        const data = Object.assign(entry, itemMeta)

        return new Item(data, entry.name)
    }
    
    public async create(collectionPath: string, data: item): Promise<item> {

        const entry = DirectoryEntry.directory(`${collectionPath}/${data.id}`)
        
        await this.drive.mkdir(entry.path)
        
        const metas = await this.findMetas(collectionPath)

        metas.push({
            ...data,
            itemId: data.id,
        })

        await this.updateMetas(collectionPath, metas)

        return data
    }
    
    public async updateById(collectionPath: string, itemId: string, data: any): Promise<void> {
        const entry = DirectoryEntry.directory([collectionPath, itemId].join('/'))

        const isValid = await this.drive.exists(entry.path)

        if (!isValid) return

        const metas = await this.findMetas(collectionPath)
        
        const oldMeta = metas.find(m => m.itemId === itemId)
        const newMeta = Object.assign(oldMeta ?? {}, data, { itemId })
        
        const index = metas.findIndex(m => m.itemId === itemId)

        if (index === -1) metas.push(newMeta)

        if (index !== -1) metas[index] = newMeta

        await this.updateMetas(collectionPath, metas)        
    }
    
    public async deleteById(collectionPath: string, itemId: string): Promise<void> {
        const entry = DirectoryEntry.directory([collectionPath, itemId].join('/'))

        await this.drive.delete(entry.path)

    }

}