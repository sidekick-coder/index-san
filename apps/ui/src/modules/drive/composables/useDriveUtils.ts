export function basename(path: string){
    return path.split('/').pop() as string
}

export function dirname(path: string){
    return path.split('/').slice(0, -1).join('/')
}

export function encode(contents: string){
    return new TextEncoder().encode(contents)
}

export function decode(contents: Uint8Array){
    return new TextDecoder().decode(contents)
}

export function resolve(...args: string[]) {
	const resolved = args
		.map(a => a.replace(/\/\//g, '/'))
		.map(a => a.split('/'))
		.flat()
		.filter(Boolean)
		.join('/')

	const isAbsolute = args[0].startsWith('/')

	const normalized = resolved.split('/').reduce((acc, segment) => {
		if (segment === '.' || segment === '.') {
			return acc
		}

		if (segment === '..') {
			acc.pop()
			return acc
		}

		acc.push(segment)

		return acc
	}, [] as string[]).join('/')


	return isAbsolute ? `/${normalized}` : normalized
}
