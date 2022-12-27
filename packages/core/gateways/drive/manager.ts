import Drive from './drive'

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

    private async execute<T extends (d: Drive) => any>(cb: T): Promise<ReturnType<T>> {
        const drive = this._drives[this._currentDrive]

        drive.config = this._currentConfig

        const result = await cb(drive)

        drive.config = {}

        return result
    }

    public async exists(entryPath: string) {
        return this.execute((d) => d.exists(entryPath))
    }

    public async list(entryPath: string) {
        return this.execute((d) => d.list(entryPath))
    }

    public async get(entryPath: string) {
        return this.execute((d) => d.get(entryPath))
    }

    public async mkdir(entryPath: string) {
        return this.execute((d) => d.mkdir(entryPath))
    }

    public async move(source: string, target: string) {
        return this.execute((d) => d.move(source, target))
    }

    public async read(entryPath: string) {
        return this.execute((d) => d.read(entryPath))
    }

    public async readAsString(entryPath: string) {
        const decoder = new TextDecoder()

        const uint = await this.execute((d) => d.read(entryPath))

        return uint ? decoder.decode(uint) : uint
    }

    public async write(entryPath: string, content: Uint8Array | string) {
        const encoder = new TextEncoder()

        if (typeof content === 'string') {
            content = encoder.encode(content)
        }

        return this.execute((d) => d.write(entryPath, content as Uint8Array))
    }

    public async delete(entryPath: string) {
        return this.execute((d) => d.delete(entryPath))
    }
}
