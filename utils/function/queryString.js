export default function toQueryString(obj) {
  const isObject = obj => typeof obj === 'object' && obj !== null;
  if(!isObject(obj)) return ''
  if(!Object.keys(obj).length) return ''
  return (
    '?' +
    Object.keys(obj)
      .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]))
      .join('&')
  )
}
