import i18n from '@plugins/i18n'
import { config } from '@vue/test-utils'

config.global.stubs['fa-icon'] = true
config.global.stubs['router-link'] = true

config.global.config.warnHandler = () => true

config.global.renderStubDefaultSlot = true
config.global.mocks.$t = (key: string) => key
config.global.plugins = [i18n]

window.clientConfig = {
    useCase: () => Promise.reject('Not implemented'),
    open: {
        url: () => Promise.reject('Not implemented'),
        directory: () => Promise.reject('Not implemented'),
    },
}
