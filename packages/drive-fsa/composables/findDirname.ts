export function findDirname(path: string){
    const args = path
        .split('/')
        .slice(0, -1)
        .filter(Boolean)
        .join('/')

    return args === '' ? '/' : args
}