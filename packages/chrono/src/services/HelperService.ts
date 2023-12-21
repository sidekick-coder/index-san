export default class HelperService {
    public static encode(content: string) {
        return new TextEncoder().encode(content)
    }

    public static decode(content: Uint8Array) {
        return new TextDecoder('utf-8').decode(content)
    }
}
