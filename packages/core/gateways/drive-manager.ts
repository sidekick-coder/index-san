import DirectoryEntry from "../entities/directory-entry";

export interface Drive {
    config: Record<string, any>;
    exists: (path: string) => Promise<boolean>;
    list: (path: string) => Promise<DirectoryEntry[]>;
    get: (path: string) => Promise<DirectoryEntry | null>;
    create: (entry: DirectoryEntry, content?: Buffer) => Promise<DirectoryEntry>;
    update: (path: string, newPath: string, newContent?: Buffer) => Promise<void>;
    delete(path:string): Promise<void>
    
    read: (path: string) => Promise<Buffer>;
}

export default class DriveManager<T extends Record<string, Drive> = any> implements Drive {
    private _currentConfig = {}
    private _currentDrive: keyof T
    private _drives: T
   
    constructor(drives: T, defaultDrive: keyof T) {
        this._drives = drives
        this._currentDrive = defaultDrive
    }

    public use(name: keyof T) {
        this._currentDrive = name
        
        return this
    }

    public getCurrentDrive() {
        return this._currentDrive
    }

    public getCurrentConfig() {
        return this._currentConfig
    }

    public listDrives() {
        return this._drives
    }

    public config(config: Record<string, any>) {
        this._currentConfig = config
        
        return this
    }    

    private async execute<T extends (d: Drive) => any>(cb: T): Promise<ReturnType<T>>  {
        const drive = this._drives[this._currentDrive]

        drive.config = this._currentConfig

        const result = await cb(drive)

        drive.config = {}

        return result
    }

    public async exists(path: string) {
        return this.execute(d => d.exists(path))
    }

    public async list(path: string) {
        return this.execute(d => d.list(path))
    }    

    public async get(path: string) {
        return this.execute(d => d.get(path))
    }

    public async create(entry: DirectoryEntry, content?: Buffer) {
        return this.execute(d => d.create(entry, content))
    }
    
    public async update(path: string, newPath: string, newContent?: Buffer) {
        return this.execute(d => d.update(path, newPath, newContent))
    }   
    
    public async delete(path: string) {
        return this.execute(d => d.delete(path))
    }
    
    public async read(path: string) {
        return this.execute(d => d.read(path))
    }
}