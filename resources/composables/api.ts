interface WindowAPi {
    invoke<T = any>(name: string, args?: any): Promise<T>;
}

export function useWindowApi(): WindowAPi {
    return (window as any).WINDOW_API;
}