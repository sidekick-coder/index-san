import { config } from '@vue/test-utils'

config.global.stubs['fa-icon'] = true
config.global.stubs['router-link'] = true

config.global.config.warnHandler = () => true

config.global.renderStubDefaultSlot = true
config.global.mocks.$t = (key: string) => key

window.clientConfig = {
    useCase: () => Promise.reject('Not implemented'),
    open: {
        url: () => Promise.reject('Not implemented'),
        directory: () => Promise.reject('Not implemented'),
    },
}
