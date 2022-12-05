import App from '@core/app'

export interface DataResponse<T> {
    data: T
}

export async function useCase<T = any>(name: keyof App['cases'], args?: any): Promise<T> {
    args = args ? JSON.parse(JSON.stringify(args)) : {}

    console.debug(`use-case(${name}): payload`, args)

    const promise = () => (window as any).useCase(name, args) as Promise<T>

    let result

    await promise()
        .then((r) => (result = r))
        .catch((err) => console.error(err.message))

    console.debug(`use-case(${name}): result`, result)

    return result as T
}
