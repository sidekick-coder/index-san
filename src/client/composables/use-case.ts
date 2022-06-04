const defaultUseCase = (window as any).useCase

export function useCase<T = any>(name: string, args?: any): Promise<T> {
  return defaultUseCase(name, JSON.parse(JSON.stringify(args || {})))
}
