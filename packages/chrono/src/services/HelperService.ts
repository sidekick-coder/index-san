export default class HelperService {
    public static basename(path: string) {
        const parts = path.split('/')

        return parts[parts.length - 1]
    }

    public static encode(content: string) {
        return new TextEncoder().encode(content)
    }

    public static decode(content?: Uint8Array | null) {
        if (!content) {
            return ''
        }
        return new TextDecoder('utf-8').decode(content)
    }
}
