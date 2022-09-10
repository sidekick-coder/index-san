import DirectoryEntry from '../entities/directory-entry'

export interface Drive {
    config: Record<string, any>;
    exists: (entryPath: string) => Promise<boolean>;
    list: (entryPath: string) => Promise<DirectoryEntry[]>;
    get: (entryPath: string) => Promise<DirectoryEntry | null>;
    mkdir: (entryPath: string) => Promise<DirectoryEntry>;
    
    move: (source: string, target: string) => Promise<void>;
    read: (entryPath: string) => Promise<Buffer | null>;
    write: (entryPath: string, content: Buffer) => Promise<void>;
    
    delete(entryPath:string): Promise<void>
}

export default class DriveManager<T extends Record<string, Drive> = any> implements Drive {
    private _currentConfig = {}
    private _currentDrive: keyof T
    private _drives: T
   
    constructor(drives: T, defaultDrive?: keyof T) {
        this._drives = drives

        if (defaultDrive) this._currentDrive = defaultDrive
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

    public async exists(entryPath: string) {
        return this.execute(d => d.exists(entryPath))
    }

    public async list(entryPath: string) {
        return this.execute(d => d.list(entryPath))
    }    

    public async get(entryPath: string) {
        return this.execute(d => d.get(entryPath))
    }
    
    public async mkdir(entryPath: string) {
        return this.execute(d => d.mkdir(entryPath))
    }
    
    public async move(source: string, target: string) {
        return this.execute(d => d.move(source, target))
    }

    public async read(entryPath: string) {
        return this.execute(d => d.read(entryPath))
    }

    public async write(entryPath: string, content: Buffer) {
        return this.execute(d => d.write(entryPath, content))
    }
    
    public async delete(entryPath: string) {
        return this.execute(d => d.delete(entryPath))
    }
    
}