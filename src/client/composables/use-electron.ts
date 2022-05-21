interface Electron {
  showOpenDialog: (args: any) => Promise<any>
}

export function useElectron(): Electron {
  return (window as any).electron
}
