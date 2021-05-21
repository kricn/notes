
import { h, Fragment, Portal } from '../core/h'
import { render } from '../core/render'

const app = document.getElementById('app')

// 组件
class MyComponent {
  // 自身状态 or 本地状态
  localState = 'one'

  // mounted 钩子
  mounted() {
    // 两秒钟之后修改本地状态的值，并重新调用 _update() 函数更新组件
    setTimeout(() => {
      this.localState = 'two'
      this._update()
    }, 2000)
  }

  render() {
    return h('div', null, this.localState)
  }
}

// 子组件类
class ChildComponent {
  render() {
    // 子组件中访问外部状态：this.$props.text
    return h('div', null, this.$props.text)
  }
}
// 父组件类
class ParentComponent {
  localState = 'one'

  mounted() {
    // 两秒钟后将 localState 的值修改为 'two'
    setTimeout(() => {
      this.localState = 'two'
      this._update()
    }, 2000)
  }

  render() {
    return h(ChildComponent, {
      // 父组件向子组件传递的 props
      text: this.localState
    })
  }
}

function MyFunctionalComponent() {
  // 返回要渲染的内容描述，即 VNode
  return h(
    'div',
    {
      style: {
        background: 'green'
      }
    },
    [
      h('span', null, '我是组件的标题1......'),
      h('span', null, '我是组件的标题2......')
    ]
  )
}

const vnode = h('div', null,
  h('p', {
    style: {
      height: '100px',
      width: '100px',
      background: 'red'
    }
  }, 'aaa')
)

// 旧的 VNode
const prevVNode = h('div', null, [
  h('p', { key: 'a' }, '节点1'),
  h('p', { key: 'b' }, '节点2'),
  h('p', { key: 'c' }, '节点3')
])

// 新的 VNode
const nextVNode = h('div', null, [
  h('p', { key: 'd' }, '节点4'),
  h('p', { key: 'a' }, '节点1'),
  h('p', { key: 'b' }, '节点2')
])

const compVnode = h(ParentComponent, null, null)

console.log(vnode)

// render(compVnode, app)
// render(vnode, app)
// render(nextVNode, app)
render(prevVNode, app)
// 2秒后更新
setTimeout(() => {
  render(nextVNode, app)
}, 2000)



