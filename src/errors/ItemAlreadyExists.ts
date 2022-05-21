export default class ItemAlreadyExists extends Error {
  constructor(path: string) {
    super(`Item with path ${path} already exists`)
  }
}
