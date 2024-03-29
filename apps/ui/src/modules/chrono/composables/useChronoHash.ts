import type IHash from "chrono/src/gateways/IHash"

export function useChronoHash(): IHash {    

    const hash: IHash['hash'] = async (content: Uint8Array) => {
        const hashBuffer = await crypto.subtle.digest('SHA-256', content)

        const result = Array.from(new Uint8Array(hashBuffer))
            .map((bytes) => bytes.toString(16).padStart(2, '0'))
            .join('')

        return result
    }

    return {
        hash
    }
}