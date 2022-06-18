export default class ItemNotFound extends Error {
  constructor() {
    super('Item not found')
  }
}
