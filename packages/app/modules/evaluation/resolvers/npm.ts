import { defineResolver } from '../helpers/define-resolver'

export default defineResolver({
    test: (id) => id.startsWith('npm:'),
    resolve: async (id) => {
        const name = id.replace('npm:', '')
        const version = 'latest'
        const url = `https://unpkg.com/${name}@${version}?module`

        return import(url)
    },
})
