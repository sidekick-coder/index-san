export default interface IDrive {
    resolve: (...args: string[]) => string
    read: (path: string) => Promise<Uint8Array | null>
    write: (path: string, content: Uint8Array) => Promise<void>
    mkdir: (path: string) => Promise<void>
    exists: (path: string) => Promise<boolean>
}