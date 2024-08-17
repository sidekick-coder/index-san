import { isRootPath } from "./isRootPath"

export function resolvePath (...path: string[]) {
    if (isRootPath(path.join('/'))) {
        return '/'
    }

    return path.join('/').replace('//', '/')
}
