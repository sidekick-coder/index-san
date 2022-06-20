export default class ItemAlreadyExists extends Error {
  constructor() {
    super('Item already exists')
  }
}
