const defaultUseCase = (window as any).useCase

export function useCase<T = any>(name: string, args?: any): Promise<T> {
  console.debug(name, args)
  return defaultUseCase(name, JSON.parse(JSON.stringify(args || {})))
}
