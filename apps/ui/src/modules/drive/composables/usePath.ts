export function basename(path: string){
    return path.split('/').pop() as string
}

export function dirname(path: string){
    return path.split('/').slice(0, -1).join('/')
}

export function usePath(){
    return {
        basename,
        dirname
    }
}