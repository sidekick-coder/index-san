
export async function useCase<T = void>(name: string, args?: any): Promise<T> {
    
    args = args ? JSON.parse(JSON.stringify(args)) : {}

    console.debug('use-case: ', name, args)

    const promise = () => (window as any).useCase(name, args) as Promise<T>
    
    let result

    await promise()
        .then(r => result  = r)
        .catch(err => alert(err.message))

    return result as T
}