interface Options {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
    body?: any
}

const apiToken = ref()

export async function $api(path: string, options: Options = {}) {
    const url = `${import.meta.env.VITE_APP_API_URL}${path}`

    const response = await fetch(url, {
        method: options.method || 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': apiToken.value ? `Bearer ${apiToken.value}` : ''
        },
        body: JSON.stringify(options.body)
    })

    if (!response.ok) {
        throw new Error('Something went wrong')
    }

    return await response.json()
}

$api.setApiToken = (token?: string) => {
    apiToken.value = token
}
