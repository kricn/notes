import { 
  setAttribute, 
  unmountComponent, 
  setComponentProps,
  createComponent
} from './react-dom'
/**
 * @param {HTMLElement} dom 真实DOM
 * @param {vnode} vnode 虚拟DOM
 * @param {HTMLElement} container 容器
 * @returns {HTMLElement} 更新后的DOM
 */
export function diff(dom, vnode, container) {
  // diff 算法
  const ret = diffNode(dom, vnode);
  // 单独判断根节点，diffNode 是无法判断到到根节点
  if (container && ret.parentNode !== container) {
    container.appendChild(ret);
  }

  return ret;

}

function diffNode(dom, vnode) {

  let out = dom;

  if (vnode === undefined || vnode === null || typeof vnode === 'boolean') vnode = '';

  if (typeof vnode === 'number') vnode = String(vnode);

  // diff text node
  if (typeof vnode === 'string') {

    // 如果当前的DOM就是文本节点，则直接更新内容
    if (dom && dom.nodeType === 3) {    // nodeType: https://developer.mozilla.org/zh-CN/docs/Web/API/Node/nodeType
      if (dom.textContent !== vnode) {
        dom.textContent = vnode;
      }
      // 如果DOM不是文本节点，则新建一个文本节点DOM，并移除掉原来的
    } else {
      out = document.createTextNode(vnode);
      if (dom && dom.parentNode) {
        dom.parentNode.replaceChild(out, dom);
      }
    }

    return out;
  }

  if (typeof vnode.tag === 'function') {
    return diffComponent(dom, vnode);
  }

  // dom 不存在 vnode 存在，或者两者都存在但标签类型不一样(tag 不一样)
  if (!dom || !isSameNodeType(dom, vnode)) {
    out = document.createElement(vnode.tag);

    if (dom) {
      [...dom.childNodes].map(out.appendChild);    // 将原来的子节点移到新节点下

      if (dom.parentNode) {
        dom.parentNode.replaceChild(out, dom);    // 移除掉原来的DOM对象
      }
    }
  }
  // 判断子节点
  if (vnode.children && vnode.children.length > 0 || (out.childNodes && out.childNodes.length > 0)) {
    diffChildren(out, vnode.children);
  }
  // 更新属性
  diffAttributes(out, vnode);

  return out;

}

function diffChildren(dom, vchildren) {

  const domChildren = dom.childNodes;
  //  对 dom 节点分类，分为有 key 的和无 key 的
  // 没有 key 的节点
  const children = [];
  // 有 key 的节点
  const keyed = {};
  if (domChildren.length > 0) {
    for (let i = 0; i < domChildren.length; i++) {
      const child = domChildren[i];
      const key = child.key;
      if (key) {
        keyed[key] = child;
      } else {
        children.push(child);
      }
    }
  }

  if (vchildren && vchildren.length > 0) {

    let min = 0;
    let childrenLen = children.length;

    for (let i = 0; i < vchildren.length; i++) {

      const vchild = vchildren[i];
      const key = vchild.key;
      let child;  // 等下用来保存 dom 上的节点的

      // 尝试从 dom 节点中匹配到与当前 key 相同或标签相同的节点
      if (key) {
        // 有 key，看能不和 dom 上的匹配上
        if (keyed[key]) {
          child = keyed[key];
          keyed[key] = undefined;
        }

      } else if (min < childrenLen) {
        // 没有 key，一个个对象 dom 上没有 key 的节点
        for (let j = min; j < childrenLen; j++) {

          let c = children[j];
          // 找到标签相同的
          if (c && isSameNodeType(c, vchild)) {

            child = c;
            children[j] = undefined;
            // 如果是在最后一个 children 找到的，下次将不再参与比较
            if (j === childrenLen - 1) childrenLen--;
            // 如果是第一个找到的，下次也不再参与比较
            if (j === min) min++;
            break;

          }

        }

      }

      child = diffNode(child, vchild);

      const f = domChildren[i]; // dom 节点和 vnode 节点数量不一样，所以 f 可能为空
      if (child && child !== dom && child !== f) {
        // dom 上没有，添加
        if (!f) {
          dom.appendChild(child);
        // 和 dom 上的下个兄弟节点一样，移除 dom 上的节点
        } else if (child === f.nextSibling) {
          removeNode(f);
        } else {
          // f 前面插入节点
          dom.insertBefore(child, f);
        }
      }

    }
  }

}

function diffComponent(dom, vnode) {

  let c = dom && dom._component;
  let oldDom = dom;

  // 如果组件类型没有变化，则重新set props
  if (c && c.constructor === vnode.tag) {
    setComponentProps(c, vnode.attrs);
    dom = c.base;
    // 如果组件类型变化，则移除掉原来组件，并渲染新的组件
  } else {

    if (c) {
      unmountComponent(c);
      oldDom = null;
    }

    c = createComponent(vnode.tag, vnode.attrs);

    setComponentProps(c, vnode.attrs);
    dom = c.base;

    if (oldDom && dom !== oldDom) {
      oldDom._component = null;
      removeNode(oldDom);
    }

  }

  return dom;

}


function isSameNodeType(dom, vnode) {
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return dom.nodeType === 3;
  }

  if (typeof vnode.tag === 'string') {
    return dom.nodeName.toLowerCase() === vnode.tag.toLowerCase();
  }

  return dom && dom._component && dom._component.constructor === vnode.tag;
}

function diffAttributes(dom, vnode) {

  const old = {};    // 当前DOM的属性
  const attrs = vnode.attrs;     // 虚拟DOM的属性

  for (let i = 0; i < dom.attributes.length; i++) {
    const attr = dom.attributes[i];
    old[attr.name] = attr.value;
  }

  // 如果原来的属性不在新的属性当中，则将其移除掉（属性值设为undefined）
  for (let name in old) {

    if (!(name in attrs)) {
      setAttribute(dom, name, undefined);
    }

  }

  // 更新新的属性值
  for (let name in attrs) {

    if (old[name] !== attrs[name]) {
      setAttribute(dom, name, attrs[name]);
    }

  }

}

function removeNode(dom) {

  if (dom && dom.parentNode) {
    dom.parentNode.removeChild(dom);
  }

}