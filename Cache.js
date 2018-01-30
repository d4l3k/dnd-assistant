export default () => {
  const cache = {}

  return (fn, prefix) => {
    let str = fn.toString()
    if (prefix) {
      str = prefix + str
    }
    if (cache.hasOwnProperty(str)) {
      return cache[str]
    }
    cache[str] = fn
    return fn
  }
}
