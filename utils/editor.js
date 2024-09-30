// 定义一个推文editor实例
let tweetEditor = null
export function setTweetEditor(editor) {
  tweetEditor = editor
}
export function getTweetEditor() {
  return tweetEditor
}
export function removeTweetEditor() {
  tweetEditor = null
}

// 定义一个SlateEditor实例
let slateEditor = null
export function setSlateEditor(editor) {
  slateEditor = editor
}
export function getSlateEditor() {
  return slateEditor
}
export function removeSlateEditor() {
  slateEditor = null
}
