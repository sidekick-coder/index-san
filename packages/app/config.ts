import type CoreApp from '@index-san/core/app'

interface OpenResult {
    displayName: string
    path: string
    metadata: Record<string, any>
}

export interface ClientAppConfig {
    useCase: CoreApp['useCase']
    open: {
        url: (href: string) => Promise<void>
        directory: () => Promise<OpenResult>
    }
}

declare global {
    interface Window {
        clientConfig: ClientAppConfig
    }
}
