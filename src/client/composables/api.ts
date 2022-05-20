interface FilesystemHelper {
  basename(args: string): string
  extname(args: string): string
  resolve(...args: string[]): string
  systemResolve(...args: string[]): string
  normalizePath(...args: string[]): string[]
}

interface Response<T> {
  success: boolean
  data: T
}
interface WindowAPi {
  invoke<T = any>(name: string, args?: any): Promise<T>
  get<T = any>(name: string): Promise<Response<T>>
  patch<T = any>(name: string, data?: any): Promise<Response<T>>
  on: (event: string, cb: (...args: any[]) => void) => void
  filesystem: FilesystemHelper
}

export function useWindowApi(): WindowAPi {
  return (window as any).WINDOW_API
}
