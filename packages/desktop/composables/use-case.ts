import { useStore } from '@modules/notify/store'
import { i18n } from '@plugins/i18n'

import { CasesKeys, CasesMethod, CasesParams } from '@core/app'

export interface DataResponse<T> {
    data: T
}

export async function useCase<K extends CasesKeys, T = CasesMethod<K>>(
    name: K,
    args?: CasesParams<K>,
    silent = false
): Promise<Awaited<T>> {
    const notify = useStore()
    const start = Date.now()

    args = args ? JSON.parse(JSON.stringify(args)) : {}

    let result: any = undefined
    let error: any = undefined

    await window.clientConfig
        .useCase(name, args as any)
        .then((r: any) => (result = r))
        .catch((e: any) => (error = e))

    if (import.meta.env.MODE !== 'test') {
        console.debug(`[app] use-case(${name}):`, {
            payload: args,
            error,
            result,
            time: Date.now() - start,
        })
    }

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
