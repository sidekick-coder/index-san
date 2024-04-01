import { isRootPath } from "./isRootPath"

export function resolvePath (...path: string[]) {
    if (isRootPath(path.join('/'))) {
        return '/'
    }

    const newPath = path.join('/').replace('//', '/')

    if (newPath[0] === '/') {
        return newPath.slice(1)
    }

    return newPath
}