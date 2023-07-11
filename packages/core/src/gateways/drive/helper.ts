class Helper {
    public decoder = new TextDecoder()
    public encoder = new TextEncoder()

    public encode(bytes: Uint8Array | string | any[] | Record<string, any>): Uint8Array {
        if (Array.isArray(bytes) || typeof bytes === 'object') {
            bytes = JSON.stringify(bytes, null, 4)
        }

        if (typeof bytes === 'string') {
            bytes = this.encoder.encode(bytes)
        }

        return bytes as Uint8Array
    }

    public isJSON(source: string) {
        try {
            JSON.parse(source)
            return true
        } catch (error) {
            return false
        }
    }

    public toString(bytes: Uint8Array) {
        return this.decoder.decode(bytes)
    }

    public toArray<T = any[]>(bytes: Uint8Array): T {
        const source = this.decoder.decode(bytes)

        let result = [] as T

        if (this.isJSON(source)) {
            result = JSON.parse(source)
        }

        return result
    }

    public toObject<T = any[]>(bytes: Uint8Array): T {
        const source = this.decoder.decode(bytes)

        let result = [] as T

        if (this.isJSON(source)) {
            result = JSON.parse(source)
        }

        return result
    }
}

const DriveHelper = new Helper()

export default DriveHelper
