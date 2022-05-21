interface UseCase<T = any> {
  (name: string, args?: any): Promise<T>
}

export const useCase: UseCase = (window as any).useCase
