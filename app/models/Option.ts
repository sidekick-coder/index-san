import { Query } from '@code-pieces/db-json'
import { container, delay, inject } from 'tsyringe'

import IndexSan from 'IndexSan'
import { isJSON } from '../../helpers/is-json'

export default class Option<T = string> {
  public name: string
  public value: T

  public static query() {
    const app = container.resolve(IndexSan)

    const filename = app.userDataPath('options.json')

    return Query.from(filename)
  }

  public static async find<T = string>(name: string) {
    const [item] = await this.query().where('name', name)

    if (!item) return null

    const option = new Option<T>()

    if (isJSON(item.value)) {
      item.value = JSON.parse(item.value)
    }

    option.name = item.name
    option.value = item.value

    return option
  }

  public static async set(name: string, value: any) {
    const option = await Option.find(name)

    const query = this.query()

    if (Array.isArray(value) || typeof value === 'object') {
      value = JSON.stringify(value)
    }

    if (option) {
      return query.where('name', name).update({ value })
    }

    return query.insert({ name, value })
  }

  public static async get<T = any>(name: string, defaultValue?: T) {
    const option = await this.find(name)

    return (option ? option.value : defaultValue) as T
  }
}
