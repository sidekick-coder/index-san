import { useStore } from '@/modules/notify/store'

import App from '@/services/app'

import { i18n } from '@/plugins/i18n'

export interface DataResponse<T> {
    data: T
}

export async function useCase<
    K extends keyof typeof App['cases'],
    T = ReturnType<typeof App['cases'][K]['execute']>
>(
    name: K,
    args?: Parameters<typeof App['cases'][K]['execute']>[0],
    silent = false
): Promise<Awaited<T>> {
    const notify = useStore()
    const start = Date.now()

    args = args ? JSON.parse(JSON.stringify(args)) : {}

    const option = App.cases[name]

    if (!option) {
        throw new Error(`use-case "${name}" not found`)
    }

    let result: any = undefined
    let error: any = undefined

    await option
        .execute(args as any)
        .then((r: any) => (result = r))
        .catch((e: any) => (error = e))

    console.debug(`[app] use-case(${name}):`, {
        payload: args,
        error,
        result,
        time: Date.now() - start,
    })

    if (!error) return Promise.resolve(result as T)

    let message = error.message || error

    if (error.i18nKey) {
        message = i18n.global.t(error.i18nKey, error.i18nArgs)
    }

    if (!silent) {
        notify.error(message)
        console.error(error)
    }

    return Promise.reject(error) as any
}
