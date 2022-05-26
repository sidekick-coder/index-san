export function createTimer() {
  const start = Date.now()

  function get() {
    return Date.now() - start
  }

  return { get }
}
