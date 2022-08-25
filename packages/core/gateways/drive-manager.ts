import DirectoryEntry from "../entities/directory-entry";

export interface Drive {
    config: Record<string, any>;
    list: (path: string) => Promise<DirectoryEntry[]>;
    get: (path: string) => Promise<DirectoryEntry | null>;
    exists: (path: string) => Promise<boolean>;
    write: (entry: DirectoryEntry, content?: Buffer) => Promise<DirectoryEntry>;
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

    public async list(path: string) {
        const drive = this._drives[this._currentDrive]

        drive.config = this._currentConfig

        const files = await drive.list(path)

        drive.config = {}

        return files
    }

    public async exists(path: string) {
        const drive = this._drives[this._currentDrive]

        drive.config = this._currentConfig

        const result = await drive.exists(path)

        drive.config = {}

        return result
    }

    public async write(entry: DirectoryEntry, content?: Buffer) {
        const drive = this._drives[this._currentDrive]

        drive.config = this._currentConfig

        await drive.write(entry)

        drive.config = {}

        return entry
    }

    public async get(path: string) {
        const drive = this._drives[this._currentDrive]

        drive.config = this._currentConfig

        const entry = await drive.get(path)

        drive.config = {}

        return entry
    }
}