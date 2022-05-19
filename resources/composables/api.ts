interface FilesystemHelper {
  resolve(...args: string[]): string
  normalizePath(...args: string[]): string[]
}
interface WindowAPi {
  invoke<T = any>(name: string, args?: any): Promise<T>
  filesystem: FilesystemHelper
}

export function useWindowApi(): WindowAPi {
  return (window as any).WINDOW_API
}