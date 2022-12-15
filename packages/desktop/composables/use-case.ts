import { useStore } from '@/modules/notify/store'

import App from '@core/app'
import { i18n } from '@/plugins/i18n'

export interface DataResponse<T> {
    data: T
}

export async function useCase<
    K extends keyof App['cases'],
    T = ReturnType<App['cases'][K]['execute']>
>(name: K, args?: Parameters<App['cases'][K]['execute']>[0]): Promise<Awaited<T>> {
    const notify = useStore()

    args = args ? JSON.parse(JSON.stringify(args)) : {}

    const promise = () => (window as any).useCase(name, args) as Promise<any>

    const { error, result } = await promise()

    console.debug(`[app] use-case(${name}):`, {
        payload: args,
        error,
        result,
    })

    if (!error) return Promise.resolve(result as T)

    let message = error.message

    if (error.i18nKey) {
        message = i18n.global.t(error.i18nKey, error.i18nArgs)
    }

    notify.error(message)
    console.error(Object.assign(new Error(), error))

    return Promise.reject(error) as any
}
