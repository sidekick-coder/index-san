export function findBasename(path: string){
    return path.split('/').pop() || '/'
}