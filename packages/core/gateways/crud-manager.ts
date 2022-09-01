import DirectoryEntry from "../entities/directory-entry"
import Item from "../entities/item"
import { Drive } from "./drive-manager"

export interface Crud {
    drive: Drive
    list(entry: DirectoryEntry): Promise<Item[]>
}

export default class CrudManager<T extends Record<string, Crud> = any> implements Omit<Crud, 'drive'> {
    private _currentCrud: keyof T
    private _drive: Drive
    private _allCruds: T
    
    constructor(cruds: T){
        this._allCruds = cruds
    }

    public use(name: keyof T) {
        this._currentCrud = name
        return this
    }
    
    public useDrive(drive: Drive) {
        this._drive = drive
    }

    public getCruds(){
        return this._allCruds
    }
    
    public getCurrent(){
        return this._currentCrud
    }

    private async execute<T extends (d: Crud) => any>(cb: T): Promise<ReturnType<T>>  {
        const crud = this._allCruds[this._currentCrud]

        crud.drive = this._drive

        const result = await cb(crud)

        return result
    }

    public async list(entry: DirectoryEntry): Promise<Item[]> {
        return this.execute(c => c.list(entry))
    }
}