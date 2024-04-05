import ChronoObject from './ChronoObject'


export default class ChronoObjectBlob extends ChronoObject {
    public get blobHash() {
        return this.head.blobHash
    }

    public serialize() {
        return {
            hash: this.hash,
            type: this.type,
            blobHash: this.blobHash,
        }
    }
}
