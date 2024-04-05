export function encode(contents: string){
    return new TextEncoder().encode(contents)
}

export function decode(contents: Uint8Array){
    return new TextDecoder().decode(contents)
}

export function useEncoder(){
    return {
        encode,
        decode
    }
}