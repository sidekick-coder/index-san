import InMemoryApp from '@index-san/core/__tests__/in-memory-config'
import IndexSan from '@index-san/core/app'

import sinon from 'sinon'

export function useApp() {
    const config = new InMemoryApp()

    const app = new IndexSan(config)

    const open = {
        directory: sinon.stub().rejects(new Error('Not implemented')),
        url: sinon.stub().rejects(new Error('Not implemented')),
    }

    window.clientConfig = {
        open,
        useCase: (name: string, args: any) => app.useCase(name as any, args),
    }

    return {
        app,
        open,
        config,
    }
}
