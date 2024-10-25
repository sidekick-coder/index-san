import { importJson, writeJson } from "@/modules/hecate/resolvers/json"

const user = ref()

export function useAuth() {

    async function findCredentials() {
        const [response, error] = await tryCatch(() => importJson('.is/credentials.json'))

        if (error) {
            return {}
        }

        return response
    }

    function reset() {
        user.value = undefined
        $api.setApiToken(undefined)
    }

    async function load() {
        const credentials = await findCredentials()

        if (!credentials.token) {
            return reset()
        }

        $api.setApiToken(credentials.token)

        const [response, error] = await tryCatch(() => $api('/api/auth/me'))

        if (error) {
            console.error(error)
            return reset()
        }

        user.value = response.data
    }

    async function login(email: string, password: string) {
        const [response, error] = await tryCatch(() => $api('/api/auth/login', {
            method: 'POST',
            body: { email, password }
        }))

        if (error) {
            console.error(error)
            return
        }

        await writeJson('.is/credentials.json', { token: response.token })

        await load()
    }

    async function logout() {
        const [, error] = await tryCatch(() => $api('/api/auth/logout', {
            method: 'POST'
        }))

        if (error) {
            console.error(error)
            return
        }

        await writeJson('.is/credentials.json', {})
        
        reset()
    }



    return {
        user: readonly(user),

        login,
        load,
        logout
    }
}

