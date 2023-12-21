export default interface IBlobRepository {
    save(content: Uint8Array): Promise<{ blobHash: string }>
    find(blobHash: string): Promise<Uint8Array | null>
}
