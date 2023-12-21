import IHash from '../gateways/IHash'
import crypto from 'crypto'

export default class InMemoryHash implements IHash {
    public async hash(content: Uint8Array): Promise<string> {
        const hash = crypto.createHash('sha1')

        hash.update(content)

        return hash.digest('hex')
    }
}
