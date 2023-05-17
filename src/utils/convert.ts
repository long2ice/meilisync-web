export function str2dict(str: string) {
  return str.split(',').reduce((acc: Record<string, any>, cur) => {
    const [key, value] = cur.split('=')
    acc[key] = value
    return acc
  }, {})
}

export function dict2str(dict: Record<string, any>, filter?: string[]) {
  return Object.entries(dict)
    .reduce((acc: string[], [key, value]) => {
      if (filter && filter.includes(key)) {
        return acc
      }
      acc.push(`${key}=${value}`)
      return acc
    }, [])
    .join(',')
}
