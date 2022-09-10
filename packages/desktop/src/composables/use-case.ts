
export function useCase<T = void>(name: string, args?: any): Promise<T> {
    return (window as any).useCase(name, args)
}