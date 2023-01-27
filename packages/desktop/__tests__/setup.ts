import { config } from '@vue/test-utils'

config.global.stubs['fa-icon'] = true
config.global.stubs['router-link'] = true

window.clientConfig = {
    useCase: () => Promise.reject('Not implemented'),
    open: {
        url: () => Promise.reject('Not implemented'),
        directory: () => Promise.reject('Not implemented'),
    },
}
