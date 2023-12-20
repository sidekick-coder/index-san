export default interface IHash {
    hash: (content: Uint8Array) => Promise<string>
}