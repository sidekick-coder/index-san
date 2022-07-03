export default class Item {
  public id: string
  public name: string
  public type: 'file' | 'folder'
  public filepath: string

  constructor(data: Item) {
    Object.assign(this, data)
  }

  public static mount(data: Item) {
    return new Item(data)
  }
}
