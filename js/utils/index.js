/**
 * 复制文本
 * @param {string} text 复制的内容
 * @param {() => void} success 成功回调
 * @param {(tip: string) => void} fail 出错回调
 * @example 
 * ```js
 * copyText(value, () => this.$message.success('复制成功'), tip => this.$message.warning(tip));
 * ```
 */
 export function copyText(text, success = null, fail = null) {
  text = text ? text.replace(/(^\s*)|(\s*$)/g, '') : '';
  if (!text) {
    typeof fail === 'function' && fail('复制的内容不能为空！');
    return;
  }
  const id = 'the-clipboard';
  /**
   * 粘贴板节点
   * @type {HTMLTextAreaElement}
   */
  let clipboard = document.getElementById(id);
  if (!clipboard) {
    clipboard = document.createElement('textarea');
    clipboard.id = id;
    clipboard.readOnly = true
    clipboard.style.cssText = 'font-size: 15px; position: fixed; top: -1000%; left: -1000%;';
    document.body.appendChild(clipboard);
  }
  clipboard.value = text;
  clipboard.select();
  clipboard.setSelectionRange(0, text.length);
  const state = document.execCommand('copy');
  if (state) {
    typeof success === 'function' && success();
  } else {
    typeof fail === 'function' && fail('复制失败');
  }
}