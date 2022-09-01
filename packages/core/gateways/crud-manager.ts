import { Drive } from "./drive-manager"

export interface Crud {
    drive: Drive
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
}