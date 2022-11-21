import Item from '../entities/item'
import { Drive } from './drive-manager'

export interface Crud {
    drive: Drive
    list(collectionPath: string): Promise<Item[]>
    findById(collectionPath: string, id: string): Promise<Item | null>
    create(collectionPath: string, data: Item): Promise<Item>
    updateById(collectionPath: string, itemId: string, data: any): Promise<void>
    deleteById(collectionPath: string, itemId: string): Promise<void>
}

export default class CrudManager<T extends Record<string, Crud> = any> {
    private _currentCrud: keyof T
    private _drive: Drive
    private _allCruds: T

    constructor(cruds: T) {
        this._allCruds = cruds
    }

    public use(name: keyof T) {
        this._currentCrud = name
        return this
    }

    public useDrive(drive: Drive) {
        this._drive = drive
        return this
    }

    public getCruds() {
        return this._allCruds
    }

    public getCurrent() {
        return this._currentCrud
    }

    private async execute<T extends (d: Crud) => any>(cb: T): Promise<ReturnType<T>> {
        const crud = this._allCruds[this._currentCrud]

        if (!crud) throw new Error('Crud implementation not found')

        crud.drive = this._drive

        const result = await cb(crud)

        return result
    }

    public async list(collectionPath: string) {
        return this.execute((c) => c.list(collectionPath))
    }

    public async findById(collectionPath: string, id: string) {
        return this.execute((c) => c.findById(collectionPath, id))
    }

    public async create(collectionPath: string, data: Item) {
        return this.execute((c) => c.create(collectionPath, data))
    }

    public async updateById(collectionPath: string, itemId: string, data: any) {
        return this.execute((c) => c.updateById(collectionPath, itemId, data))
    }

    public async deleteById(collectionPath: string, itemId: string) {
        return this.execute((c) => c.deleteById(collectionPath, itemId))
    }
}
