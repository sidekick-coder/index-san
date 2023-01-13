import { config } from '@vue/test-utils'

config.global.mocks.$t = (key: string) => key
config.global.stubs['fa-icon'] = true
config.global.stubs['router-link'] = true
