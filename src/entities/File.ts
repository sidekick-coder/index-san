import Item from './Item'

export default class File extends Item {
  public isFile = true

  constructor(data: File) {
    super(data)
  }
}
