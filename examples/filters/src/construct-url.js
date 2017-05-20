export default function constructUrl(url, searchObj) {
  if (!searchObj) {
    return url
  }

  const searchParams = new URLSearchParams()
  Object.keys(searchObj)
    .forEach((searchKey) => {
      const value = searchObj[searchKey]

      if (value instanceof Array) {
        value.forEach((valueItem) => {
          if (valueItem) {
            searchParams.append(searchKey, valueItem)
          }
        })

        return
      }

      if (value) {
        searchParams.append(searchKey, value)
      }
    })

  const paramsStr = searchParams.toString()
  if (!paramsStr || paramsStr === '?') {
    return url
  }

  return `${ url }?${ paramsStr }`
}
