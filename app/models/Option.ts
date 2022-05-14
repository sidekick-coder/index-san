import { Query } from '@code-pieces/db-json'
import { container } from 'tsyringe'

import App from '../../app'
import { isJSON } from '../../helpers/is-json'

export default class Option<T = string> {
  public name: string
  public value: T

  public static query() {
    const app = container.resolve(App)

    const filename = app.userDataPath('options.json')

    return Query.from(filename)
  }

  public static async find<T = string>(name: string) {
    const item = await this.query().findBy('name', name)

    if (!item) return null

    const option = new Option<T>()

    if (isJSON(item.value)) {
      item.value = JSON.parse(item.value)
    }

    option.name = item.name
    option.value = item.value

    return option
  }

  public static async updateOrCreate(name: string, value: string) {
    const option = await Option.find(name)

    const query = Query.from(filename)

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
