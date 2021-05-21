import { VNodeFlags, ChildrenFlags } from '../lib/vnodeFlags.js'
import { mount } from './render'

function patch(prevVNode, nextVNode, container) {
  // 分别拿到新旧 VNode 的类型，即 flags
  const nextFlags = nextVNode.flags
  const prevFlags = prevVNode.flags

  // 检查新旧 VNode 的类型是否相同，如果类型不同，则直接调用 replaceVNode 函数替换 VNode
  // 如果新旧 VNode 的类型相同，则根据不同的类型调用不同的比对函数
  if (prevFlags !== nextFlags) {
    replaceVNode(prevVNode, nextVNode, container)
  } else if (nextFlags & VNodeFlags.ELEMENT) {
    patchElement(prevVNode, nextVNode, container)
  } else if (nextFlags & VNodeFlags.COMPONENT) {
    patchComponent(prevVNode, nextVNode, container)
  } else if (nextFlags & VNodeFlags.TEXT) {
    patchText(prevVNode, nextVNode)
  } else if (nextFlags & VNodeFlags.FRAGMENT) {
    patchFragment(prevVNode, nextVNode, container)
  } else if (nextFlags & VNodeFlags.PORTAL) {
    patchPortal(prevVNode, nextVNode)
  }
}

function replaceVNode(prevVNode, nextVNode, container) {
  // 将旧的 VNode 所渲染的 DOM 从容器中移除
  container.removeChild(prevVNode.el)
  // 如果将要被移除的 VNode 类型是组件，则需要调用该组件实例的 unmounted 钩子函数
  if (prevVNode.flags & VNodeFlags.COMPONENT_STATEFUL_NORMAL) {
    // 类型为有状态组件的 VNode，其 children 属性被用来存储组件实例对象
    const instance = prevVNode.children
    instance.unmounted && instance.unmounted()
  }
  // 再把新的 VNode 挂载到容器中
  mount(nextVNode, container)
}

function patchElement(prevVNode, nextVNode, container) {
  // 如果新旧 VNode 描述的是不同的标签，则调用 replaceVNode 函数，使用新的 VNode 替换旧的 VNode
  if (prevVNode.tag !== nextVNode.tag) {
    replaceVNode(prevVNode, nextVNode, container)
    return
  }

  // 拿到 el 元素，注意这时要让 nextVNode.el 也引用该元素
  const el = (nextVNode.el = prevVNode.el)
  // 拿到 新旧 VNodeData
  const prevData = prevVNode.data
  const nextData = nextVNode.data
  // 新的 VNodeData 存在时才有必要更新
  if (nextData) {
    // 遍历新的 VNodeData，将旧值和新值都传递给 patchData 函数
    for (let key in nextData) {
      const prevValue = prevData[key]
      const nextValue = nextData[key]
      patchData(el, key, prevValue, nextValue)
    }
  }
  if (prevData) {
    // 遍历旧的 VNodeData，将已经不存在于新的 VNodeData 中的数据移除
    for (let key in prevData) {
      const prevValue = prevData[key]
      if (prevValue && !nextData.hasOwnProperty(key)) {
        // 第四个参数为 null，代表移除数据
        patchData(el, key, prevValue, null)
      }
    }
  }

  // 调用 patchChildren 函数递归地更新子节点
  patchChildren(
    prevVNode.childFlags, // 旧的 VNode 子节点的类型
    nextVNode.childFlags, // 新的 VNode 子节点的类型
    prevVNode.children,   // 旧的 VNode 子节点
    nextVNode.children,   // 新的 VNode 子节点
    el                    // 当前标签元素，即这些子节点的父节点
  )
}

const domPropsRE = /\[A-Z]|^(?:value|checked|selected|muted)$/
function patchData(el, key, prevValue, nextValue) {
  switch (key) {
    case 'style':
      for (let k in nextValue) {
        el.style[k] = nextValue[k]
      }
      for (let k in prevValue) {
        if (!nextValue.hasOwnProperty(k)) {
          el.style[k] = ''
        }
      }
      break
    case 'class':
      el.className = nextValue
      break
    default:
      if (key[0] === 'o' && key[1] === 'n') {
        // 事件
        el.addEventListener(key.slice(2), nextValue)
      } else if (domPropsRE.test(key)) {
        // 当作 DOM Prop 处理
        el[key] = nextValue
      } else {
        // 当作 Attr 处理
        el.setAttribute(key, nextValue)
      }
      break
  }
}

function patchChildren(
  prevChildFlags,
  nextChildFlags,
  prevChildren,
  nextChildren,
  container
) {
  switch (prevChildFlags) {
    // 旧的 children 是单个子节点，会执行该 case 语句块
    case ChildrenFlags.SINGLE_VNODE:
      switch (nextChildFlags) {
        case ChildrenFlags.SINGLE_VNODE:
          // 此时 prevChildren 和 nextChildren 都是 VNode 对象
          patch(prevChildren, nextChildren, container)
          break
        case ChildrenFlags.NO_CHILDREN:
          // 新的 children 中没有子节点时，会执行该 case 语句块
          container.removeChild(prevChildren.el)
          break
        default:
          // 新的 children 中有多个子节点时，会执行该 case 语句块
          // 移除旧的单个子节点
          container.removeChild(prevChildren.el)
          // 遍历新的多个子节点，逐个挂载到容器中
          for (let i = 0; i < nextChildren.length; i++) {
            mount(nextChildren[i], container)
          }
          break
      }
      break
    // 旧的 children 中没有子节点时，会执行该 case 语句块
    case ChildrenFlags.NO_CHILDREN:
      switch (nextChildFlags) {
        case ChildrenFlags.SINGLE_VNODE:
          // 新的 children 是单个子节点时，会执行该 case 语句块
          // 使用 mount 函数将新的子节点挂载到容器元素
          mount(nextChildren, container)
          break
        case ChildrenFlags.NO_CHILDREN:
          // 新的 children 中没有子节点时，会执行该 case 语句块
          break
        default:
          // 新的 children 中有多个子节点时，会执行该 case 语句块
          // 遍历多个新的子节点，逐个使用 mount 函数挂载到容器元素
          for (let i = 0; i < nextChildren.length; i++) {
            mount(nextChildren[i], container)
          }
          break
      }
      break
    // 旧的 children 中有多个子节点时，会执行该 case 语句块
    default:
      switch (nextChildFlags) {
        case ChildrenFlags.SINGLE_VNODE:
          // 新的 children 是单个子节点时，会执行该 case 语句块
          for (let i = 0; i < prevChildren.length; i++) {
            container.removeChild(prevChildren[i].el)
          }
          mount(nextChildren, container)
          break
        case ChildrenFlags.NO_CHILDREN:
          // 新的 children 中没有子节点时，会执行该 case 语句块
          for (let i = 0; i < prevChildren.length; i++) {
            container.removeChild(prevChildren[i].el)
          }
          break
        default:
          // 当新的 children 中有多个子节点时，会执行该 case 语句块
          // 初始化新旧节点的首尾指针
          let oldStartIdx = 0
          let oldEndIdx = prevChildren.length - 1
          let newStartIdx = 0
          let newEndIdx = nextChildren.length - 1
          // 首尾对应的值
          let oldStartVNode = prevChildren[oldStartIdx]
          let oldEndVNode = prevChildren[oldEndIdx]
          let newStartVNode = nextChildren[newStartIdx]
          let newEndVNode = nextChildren[newEndIdx]
          while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
            if (!oldStartVNode) {
              // 旧节点开始指针右移
              oldStartVNode = prevChildren[++oldStartIdx]
            } else if (!oldEndVNode) {
              // 旧节点结束指针左移
              oldEndVNode = prevChildren[--oldEndIdx]
            } else if (oldStartVNode.key === newStartVNode.key) {
              // 新旧开始节点匹配可以复用，打补丁
              patch(oldStartVNode, newStartVNode, container)
              // 同时新旧节点开始指针往右移动一位
              oldStartVNode = prevChildren[++oldStartIdx]
              newStartVNode = nextChildren[++newStartIdx]
            } else if (oldEndVNode.key === newEndVNode.key) {
              // 新旧尾部节点配可以复用，打补丁
              patch(oldEndVNode, newEndVNode, container)
              // 同时新旧节点开始指针往左移动一位
              oldEndVNode = prevChildren[--oldEndIdx]
              newEndVNode = nextChildren[--newEndIdx]
            } else if (oldStartVNode.key === newEndVNode.key) {
              // 旧开始节点匹配新结束节点，打补丁
              patch(oldStartVNode, newEndVNode, container)
              // 旧节点开始节点移动到旧节点尾部指针所指节点后
              container.insertBefore(
                oldStartVNode.el,
                oldEndVNode.el.nextSibling
              )
              // 旧开始节点右移，新结束节点左移
              oldStartVNode = prevChildren[++oldStartIdx]
              newEndVNode = nextChildren[--newEndIdx]
            } else if (oldEndVNode.key === newStartVNode.key) {
              // 旧结束节点匹配新开始节点，打补丁
              patch(oldEndVNode, newStartVNode, container)
              // 同理，移动旧结束节点到旧开始节点前面(此时旧开始节点指针所指的节点)
              container.insertBefore(oldEndVNode.el, oldStartVNode.el)
              // 旧结束节点左移
              oldEndVNode = prevChildren[--oldEndIdx]
              // 新开始节点右移
              newStartVNode = nextChildren[++newStartIdx]
            } else {
              // 都没有匹配到，直接遍历旧节点寻找与新节点匹配的旧节点
              const idxInOld = prevChildren.findIndex(
                node => node.key === newStartVNode.key
              )
              if (idxInOld >= 0) {
                // 匹配成功，记录匹配节点
                const vnodeToMove = prevChildren[idxInOld]
                // 打补丁
                patch(vnodeToMove, newStartVNode, container)
                // 置空子节点数组里匹配到的节点
                prevChildren[idxInOld] = undefined
                // 移动匹配到的节点到旧开始节点前
                container.insertBefore(vnodeToMove.el, oldStartVNode.el)
              } else {
                // 都没有匹配到，就是新节点，第四个参数是挂载位置
                mount(newStartVNode, container, false, oldStartVNode.el)
              }
              // 新开始节点右移动
              newStartVNode = nextChildren[++newStartIdx]
            }
          }
          if (oldEndIdx < oldStartIdx) {
            // 旧节点遍历完
            // 添加新节点
            for (let i = newStartIdx; i <= newEndIdx; i++) {
              mount(nextChildren[i], container, false, oldStartVNode.el)
            }
          } else if (newEndIdx < newStartIdx) {
            // 新节点遍历完
            // 移除操作
            for (let i = oldStartIdx; i <= oldEndIdx; i++) {
              container.removeChild(prevChildren[i].el)
            }
          }
        break
      }
      break
  }
}

function patchText(prevVNode, nextVNode) {
  // 拿到文本元素 el，同时让 nextVNode.el 指向该文本元素
  const el = (nextVNode.el = prevVNode.el)
  // 只有当新旧文本内容不一致时才有必要更新
  if (nextVNode.children !== prevVNode.children) {
    el.nodeValue = nextVNode.children
  }
}

function patchFragment(prevVNode, nextVNode, container) {
  // 直接调用 patchChildren 函数更新 新旧片段的子节点即可
  patchChildren(
    prevVNode.childFlags, // 旧片段的子节点类型
    nextVNode.childFlags, // 新片段的子节点类型
    prevVNode.children,   // 旧片段的子节点
    nextVNode.children,   // 新片段的子节点
    container
  )

  switch (nextVNode.childFlags) {
    case ChildrenFlags.SINGLE_VNODE:
      nextVNode.el = nextVNode.children.el
      break
    case ChildrenFlags.NO_CHILDREN:
      nextVNode.el = prevVNode.el
      break
    default:
      nextVNode.el = nextVNode.children[0].el
  }
}

function patchPortal(prevVNode, nextVNode) {
  patchChildren(
    prevVNode.childFlags,
    nextVNode.childFlags,
    prevVNode.children,
    nextVNode.children,
    prevVNode.tag // 注意 container 是旧的 container
  )
  // 让 nextVNode.el 指向 prevVNode.el
  nextVNode.el = prevVNode.el

  // 如果新旧容器不同，才需要搬运
  if (nextVNode.tag !== prevVNode.tag) {
    // 获取新的容器元素，即挂载目标
    const container =
      typeof nextVNode.tag === 'string'
        ? document.querySelector(nextVNode.tag)
        : nextVNode.tag

    switch (nextVNode.childFlags) {
      case ChildrenFlags.SINGLE_VNODE:
        // 如果新的 Portal 是单个子节点，就把该节点搬运到新容器中
        container.appendChild(nextVNode.children.el)
        break
      case ChildrenFlags.NO_CHILDREN:
        // 新的 Portal 没有子节点，不需要搬运
        break
      default:
        // 如果新的 Portal 是多个子节点，遍历逐个将它们搬运到新容器中
        for (let i = 0; i < nextVNode.children.length; i++) {
          container.appendChild(nextVNode.children[i].el)
        }
        break
    }
  }
}

function patchComponent(prevVNode, nextVNode, container) {
  // 检查组件是否是有状态组件
  if (nextVNode.tag !== prevVNode.tag) {
    replaceVNode(prevVNode, nextVNode, container)
  } else if (nextVNode.flags & VNodeFlags.COMPONENT_STATEFUL_NORMAL) {
    // 1、获取组件实例
    const instance = (nextVNode.children = prevVNode.children)
    // 2、更新 props
    instance.$props = nextVNode.data
    // 3、更新组件
    instance._update()
  } else {
    // 更新函数式组件
    // 通过 prevVNode.handle 拿到 handle 对象
    const handle = (nextVNode.handle = prevVNode.handle)
    // 更新 handle 对象
    handle.prev = prevVNode
    handle.next = nextVNode
    handle.container = container

    // 调用 update 函数完成更新
    handle.update()
  }
}

export {
  patch,
  patchData,
  patchChildren
}