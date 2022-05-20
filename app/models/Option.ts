import { Query } from '@code-pieces/db-json'
import { isJSON } from '../../helpers/is-json'

export default class Option<T = string | Record<string, any>> {
  constructor(public filename: string) {}

  public static from<T>(filename: string) {
    return new Option<T>(filename)
  }

  public query() {
    return Query.from(this.filename)
  }

  public async find(name: string) {
    const [item] = await this.query().where('name', name)

    if (!item) return null

    if (isJSON(item.value)) {
      item.value = JSON.parse(item.value)
    }

    return item
  }

  public async set(name: string, value: T) {
    const option = await this.find(name)

    const query = this.query()

    if (Array.isArray(value) || typeof value === 'object') {
      value = JSON.stringify(value) as any as T
    }

    if (option) {
      return query.where('name', name).update({ value })
    }

    return query.insert({ name, value })
  }

  public async get<T = any>(name: string, defaultValue?: T) {
    const option = await this.find(name)

    return (option ? option.value : defaultValue) as T
  }
}
