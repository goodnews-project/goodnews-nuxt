/**
 * @descripttion:  深拷贝
 * @param {*} obj 传入的对象
 * @return {*} 返回深拷贝后的对象
 * @example: deepClone({a:1,b:2})
 */
export function deepClone(obj) {
  if (obj === null) return null
  if (typeof obj !== 'object') return obj
  if (obj.constructor === Date) return new Date(obj)
  if (obj.constructor === RegExp) return new RegExp(obj)
  const newObj = new obj.constructor()
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      // 不遍历其原型链上的属性
      const val = obj[key]
      newObj[key] = typeof val === 'object' ? deepClone(val) : val
    }
  }
  return newObj
}

/**
 * @description: 文件大小格式化，传入文件大小和文件单位，文件单位默认为kb,返回格式化后的文件大小
 * @param {number|string,string} fileSize,unit
 * @return {string} 返回格式化后的文件大小，带单位
 */
export function formatFileSize(fileSize = 0, unit = 'kb') {
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  let index = units.indexOf(unit.toUpperCase())
  if (index === -1) {
    index = 1
  }
  let size = parseFloat(fileSize)

  // 处理无效或负值输入
  if (isNaN(size) || size < 0) {
    return '0 B'
  }
  // 循环计算，直到 size 小于 1024 或 index 超过 units 数组的长度
  while (size >= 1024 && index < units.length - 1) {
    size /= 1024
    index++
  }
  // 显示小数点后两位，不足两位不补0
  return size.toFixed(2).replace(/\.0+$/, '') + ' ' + units[index]
}

/**
 * @description: 获取浏览器语言,如果不在可选语言范围内，返回默认语言
 * @return {string} 返回浏览器语言
 */
export function getLanguage() {
  const langList = ['zh-CN', 'en']
  let lang = navigator.language || navigator.languages[0]
  if (!langList.includes(lang)) {
    lang = 'zh-CN'
  }
  return lang
}

/**
 * @description: 复制到剪切板
 * @return {*}
 */
export function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(
      function () {
        console.log('复制成功')
      },
      function (err) {
        console.error('复制失败:', err)
      }
    )
  } else {
    var textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    try {
      var successful = document.execCommand('copy')
      var msg = successful ? '复制成功' : '复制失败'
      console.log(msg)
    } catch (err) {
      console.error('无法通过 execCommand 复制', err)
    }
    document.body.removeChild(textArea)
  }
}
