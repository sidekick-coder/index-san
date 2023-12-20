import IHash from "../src/gateways/IHash";
import crypto from 'crypto'

export default class PlayHash implements IHash {
    public async hash(content: Uint8Array): Promise<string> {
        const hash = crypto.createHash('sha1')
        
        hash.update(content)
        
        return hash.digest('hex')
    }
}