export default interface IBlobRepository {
    save(content: Uint8Array): Promise<{ blobHash: string }>
    find(blobHash: string): Promise<Uint8Array | null>
    findOrFail(blobHash: string): Promise<Uint8Array>
    copyFrom(source: IBlobRepository, blobHash: string): Promise<void>
}
