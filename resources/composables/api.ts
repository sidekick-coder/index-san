interface FilesystemHelper {
  basename(args: string): string
  extname(args: string): string
  resolve(...args: string[]): string
  systemResolve(...args: string[]): string
  normalizePath(...args: string[]): string[]
}
interface WindowAPi {
  invoke<T = any>(name: string, args?: any): Promise<T>
  get<T = any>(name: string): Promise<T>
  filesystem: FilesystemHelper
}

export function useWindowApi(): WindowAPi {
  return (window as any).WINDOW_API
}
