export function findDirname(path: string){
    const result = path
        .split('/')
        .slice(0, -1)
        .filter(Boolean)
        .join('/')

	if (path.startsWith('/')) {
		return '/' + result
	}

    return result
}
