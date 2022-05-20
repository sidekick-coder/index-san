import Item from './Item'

export default class Folder extends Item {
  public isFile = true

  constructor(data: Folder) {
    super(data)
  }
}
