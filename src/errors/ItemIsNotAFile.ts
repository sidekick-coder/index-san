export default class ItemIsNotAFile extends Error {
  constructor(path: string) {
    super(`Item ${path} is not a file`)
  }
}
