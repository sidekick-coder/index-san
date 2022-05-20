import { ISEventContext } from 'lib/ISEventContext'

export function createContext(ctx?: Partial<ISEventContext>) {
  return Object.assign(
    ctx || {
      data: {},
      params: {},
    }
  )
}
