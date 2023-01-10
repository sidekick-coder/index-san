import type CoreApp from '../core/app'

export interface ClientAppConfig {
    useCase: CoreApp['useCase']
    open: {
        url: (href: string) => void
    }
}

declare global {
    interface Window {
        clientConfig: ClientAppConfig
    }
}
