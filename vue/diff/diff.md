## vue 中的 diff 算法是什么
diff算法是对比前后两次数据异同的高效算法。在 vue 中，当数据模型(M)发生改变时，触发视图(V)更新的方法 _update，这里会对真实 dom 打补丁(patch)，而打补丁的过程中用到的就是 diff 算法。vue 中的 diff 算法有两个特点：只和同层比较及双指针模式。

在研究 diff 算法前，需要知道什么是虚拟 dom(virtual dom)。

## 虚拟 dom(virtual dom)
虚拟 dom 是利用 json 形式去描述真实 dom。

假如有如下的 html 结构：
```html
<div id="box" style="color: pink;">hello world</div>
```
则用虚拟 dom 可以表示为：
```json
{
  tag: "div",
  data: {
    id: "box",
    style: {
      color: "pink"
    }
  },
  children: "hello world"
}
```
在 vue 中，虚拟 dom 的形成是通过 h 函数形成
```js
// h 函数
function h(tag, data=null, children=null, ) {
  // ...
  return {
    _isVNode: true,  // 判断是否为 vnode
    flags, // 节点类型
    tag, // 节点名称
    key: data && data.key ? data.key : null,  // 节点唯一标识，在 diff 中用来判断该节点是否能服用
    data, // 节点上的信息
    children, // 子节点
    childFlags: childFlags, // 子节点标识，存在没有子节点，单个子节点，多个子节点等类型
    el: null // 对真实 dom 的引用，当虚拟 dom 渲染成真实 dom 后，对应的真实 dom 会引用到对应的虚拟 dom 的 el 上
  }
}
```
## 渲染成真实 dom
有了虚拟 dom 之后还不行，还要渲染成真实 dom 才能显示。当我们所写的 html 转成虚拟 dom 后，通过渲染函数(render)渲染成真实 dom。
```js
function render(vnode, container) {
  const prevVNode = container.vnode
  if (prevVNode == null) {
    if (vnode) {
      // 没有旧的 VNode，只有新的 VNode。使用 `mount` 函数挂载全新的 VNode
      mount(vnode, container)
      // 将新的 VNode 添加到 container.vnode 属性下，这样下一次渲染时旧的 VNode 就存在了
      container.vnode = vnode
    }
  } else {
    if (vnode) {
      // 有旧的 VNode，也有新的 VNode。则调用 `patch` 函数打补丁
      patch(prevVNode, vnode, container)
      // 更新 container.vnode
      container.vnode = vnode
    } else {
      // 有旧的 VNode 但是没有新的 VNode，这说明应该移除 DOM，在浏览器中可以使用 removeChild 函数。
      container.removeChild(prevVNode.el)
      container.vnode = null
    }
  }
}
```
每次触发视图更新(触发 render 函数)，在非首次挂载的情况下且有生成虚拟 dom 的情况下，会调用 patch 函数，而 patch 函数中则用到了 diff 算法。
## diff 算法
上文提到 diff 算法两个特点，同层比较和双指针。在 diff 中，同层的 tag 不一样(通过 flags 判断)，则认为整个节点都不一样，包括其属性，事件和全部子节点。双指针指的是在新老虚拟 dom 的头和尾都有一个下标，如图所示：
![](https://static001.infoq.cn/resource/image/80/6d/80dc339f73b186479e6d1fc18bfbf66d.png)
通过旧 vnode 的第一个和新 vnode 的第一个比较，旧 vnode 的最后一个和新 vnode 的最后一个比较，旧 vnode 的第一个和新 vnode 的啊后一个比较，旧 vnode 的最后一个和新 vnode 的第一个比较，寻找可以复用的节点，若都没有找到，这是最差的情况，则分别遍历新旧 vnode 去寻找。其中，若有一步找到了，则接下来寻找的步骤就会跳过。

patch 流程：\
1、判断同层新老节点的类型去决定调用哪个方法\
2、标签相同则处理新旧 vnode 的子节点(以 patchElement 为例)\
3、判断子节点类型(遍历新旧节点的类型)，如旧节点中有一个子节点，新节点中有多个子节点，则做相应处理\
4、双指针用在旧节点有多个子节点，新节点也有多个子节点，则找到可以复用的节点进行移动去减少创建 dom 的开销
![](http://hcysun.me/vue-design/assets/img/diff-react-4.7443f559.png)
```javascript
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
```
## 参考
http://hcysun.me/vue-design/zh/renderer-patch.html
https://github.com/febobo/web-interview/issues/24