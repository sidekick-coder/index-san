import type CoreApp from '@index-san/core/app'

export interface ClientAppConfig {
    useCase: CoreApp['useCase']
    open: {
        url: (href: string) => Promise<void>
        directory: () => Promise<string>
    }
}

declare global {
    interface Window {
        clientConfig: ClientAppConfig
    }
}
