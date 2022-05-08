import { Query } from '@code-pieces/db-json'
import { app } from 'electron'
import { resolve } from 'path'
import { isJSON } from '../../helpers/is-json'

const filename = resolve(app.getPath('userData'), 'options.json')

export default class Option<T = string> {
  public name: string
  public value: T

  public static async find<T = string>(name: string) {
    const item = await Query.from(filename).findBy('name', name)

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
}
