# jsx 和 虚拟dom
## jsx
jsx 语法本身不被浏览器所识别，需要借助 babel 工具去转换成 js 才能执行，通过 babel 插件 babel-plugin-transform-react-jsx 可以实现 jsx 转 js
```sh
yarn add babel-preset babel-core babel-plugin-transform-react-jsx
```
安装完后需要配置 .babelrc 文件。在更目录创建 .babelrc 文件，配置：
```js
{
  "presets": ["env"],
  "plugins": [
      ["transform-react-jsx", {  // transform-react-jsx 转换 jsx 语法为 js 的 babel 插件，需要安装 babel-plugin-transform-react-jsx
          "pragma": "React.createElement"  // pragma 参数可以指定在其他地方用 React.createElement 的方式去调用这个插件
      }]
  ]
}
```
配置之后，在 js 文件里遇到 jsx 语法，会通过 babel 进行编译。编译时会寻找上下文的 React.createElement 方法去转换 jsx，所以上下文需要实现 React.createElement。 在 React 的使用中，我们即使没有使用到 React 对象，但我们还是要导入 import React from 'react', 因为 React 中包含了 createElement 方法，导入 React 对象是为了上下文环境中有 createElement 方法去解析 jsx 语法。
## 虚拟dom
通过 createElement 方法将 jsx 转成虚拟dom。createElement 方法的使用为 createElement(tag, attrs, child1, child2[, ...])，第一个参数是标签( div, span，文本节点等 )这些，第二个参数是标签里的属性( title class 等 ) 这些，剩下的是 tag 的子元素，可以是文本节点，也可以是标签。
```js
//  /core/react.js
// 实现 createElement 
export function createElement( tag, attrs, ...children ) {
  return {
      tag,
      attrs,
      children
  }
}
export default {
  createElement
}
```
# 渲染标签
更目录下新建 src 和 public 文件夹，src 下新建 main.js，public 下新建 index.html。安装编译启动器 parcel-bundler (全局安装)，实现 render 去渲染虚拟dom。
```sh
yarn global add parcel-bundler  # 运行报错就卸载了再退级 yarn global remove parcel-bundler  yarn global add parcel-bundler@1.12.3
```
配饰 package.json 脚本
```json
{
  "scripts": {
    "dev": "parcel ./public/index.html"
  },
}
```
实现 render
```js
// /core/react-router.js
// 实现 render 渲染虚拟dom
function render( vnode, container ) {
    
  // 当vnode为字符串时，渲染结果是一段文本
  if ( typeof vnode === 'string' ) {
      const textNode = document.createTextNode( vnode );
      return container.appendChild( textNode );
  }

  const dom = document.createElement( vnode.tag );

  if ( vnode.attrs ) {
      Object.keys( vnode.attrs ).forEach( key => {
          const value = vnode.attrs[ key ];
           setAttribute( dom, key, value );    // 设置属性
      } );
  }

  vnode.children.forEach( child => render( child, dom ) );    // 递归渲染子节点

  return container.appendChild( dom );    // 将渲染结果挂载到真正的DOM上
}

function setAttribute( dom, name, value ) {
  // 如果属性名是className，则改回class
  if ( name === 'className' ) name = 'class';

  // 如果属性名是onXXX，则是一个事件监听方法
  if ( /on\w+/.test( name ) ) {
      name = name.toLowerCase();
      dom[ name ] = value || '';
  // 如果属性名是style，则更新style对象
  } else if ( name === 'style' ) {
      if ( !value || typeof value === 'string' ) {
          dom.style.cssText = value || '';
      } else if ( value && typeof value === 'object' ) {
          for ( let name in value ) {
              // 可以通过style={ width: 20 }这种形式来设置样式，可以省略掉单位px
              dom.style[ name ] = typeof value[ name ] === 'number' ? value[ name ] + 'px' : value[ name ];
          }
      }
  // 普通属性则直接更新属性
  } else {
      if ( name in dom ) {
          dom[ name ] = value || '';
      }
      if ( value ) {
          dom.setAttribute( name, value );
      } else {
          dom.removeAttribute( name );
      }
  }
}

export default {
  render: ( vnode, container ) => {
      container.innerHTML = '';
      return render( vnode, container );
  }
}
```
在 index.html 中创建根节点标签
```html
<div id="app"></div>
```
开始使用
```js
// /src/main.js
import React from '../core/react'  // 需要的环境，里面包含 createElement 方法，将 jsx 转成虚拟 dom
import ReactDom from '../core/react-dom' // 渲染成页面

function tick() {
  const element = (  // jsx 
    <div>
      <h1>Hello World</h1>
      <h2>It is {new Date().toLocaleTimeString()}.</h2>
    </div>
  )
  ReactDom.render(  // 渲染
    element,
    document.getElementById("app")  // 挂在的根节点
  )
}

setInterval(tick, 1000); // 动态更新
// 以上是官方的例子 https://reactjs.org/docs/rendering-elements.html#updating-the-rendered-element
```

# 渲染组件
**组件的本质是函数**\
既然要渲染组件，则需要判断 tag 是不是函数类型即可，修改 render
```js
// /core/react-dom.js
import { Component } from './core/react' // 从 react 导入，所有类组件都继承自 Component
function render( vnode, container ) {
  return container.appendChild( _render( vnode ) );
}

function _render( vnode ) {

  if ( vnode === undefined || vnode === null || typeof vnode === 'boolean' ) vnode = '';

  if ( typeof vnode === 'number' ) vnode = String( vnode );

  if ( typeof vnode === 'string' ) {
      let textNode = document.createTextNode( vnode );
      return textNode;
  }

  // 组件渲染
  if ( typeof vnode.tag === 'function' ) {
    // 创建组件
    const component = createComponent( vnode.tag, vnode.attrs );
    // 设置组件属性并渲染组件
    setComponentProps( component, vnode.attrs );
    // 返回 html 节点
    return component.base;
  }

  const dom = document.createElement( vnode.tag );

  if ( vnode.attrs ) {
      Object.keys( vnode.attrs ).forEach( key => {
          const value = vnode.attrs[ key ];
          setAttribute( dom, key, value );
      } );
  }

  vnode.children.forEach( child => render( child, dom ) );    // 递归渲染子节点

  return dom; 
}
// ... 省略
// 创建组件
function createComponent( component, props ) {

  let inst;
  // 如果是类定义组件，则直接返回实例
  if ( component.prototype && component.prototype.render ) {
      inst = new component( props );
  // 如果是函数定义组件，则将其扩展为类定义组件
  } else {
      inst = new Component( props );
      // 将构造器指向函数组件
      inst.constructor = component;
      inst.render = function() {
          return this.constructor( props );
      }
  }
  return inst;
}

// set props
function setComponentProps( component, props ) {
  // base 为 html 元素节点，第一次渲染后，会以该属性保存节点信息，用于 diff
  // 第一次渲染
  if ( !component.base ) {
      if ( component.componentWillMount ) component.componentWillMount();
  } else if ( component.componentWillReceiveProps ) {
    // props 发生变化时重新渲染
    component.componentWillReceiveProps( props );
  }

  component.props = props;

  renderComponent( component );

}

export function renderComponent( component ) {

  let base;
  // 返回的 vnode
  const renderer = component.render();

  // 组件更新（非第一次渲染）
  if ( component.base && component.componentWillUpdate ) {
      component.componentWillUpdate();
  }

  // html 元素节点
  base = _render( renderer );

  // 非第一次更新
  if ( component.base ) {
      if ( component.componentDidUpdate ) component.componentDidUpdate();
  } else if ( component.componentDidMount ) {
    // 第一次更新
      component.componentDidMount();
  }

  // 全部更新为新的 html ，没有用到 diff 算法
  // 通过 html 替换实现
  if ( component.base && component.base.parentNode ) {
      component.base.parentNode.replaceChild( base, component.base );
  }

  // 更新挂载在组件上的 html 节点
  component.base = base;
  // 保存组件属性
  base._component = component;
}

// ... 省略
```
修改 react 内空，为其添加 Component 类
```js
// /core/react.js
import { renderComponent } from './react-dom'
export class Component {
  constructor( props = {} ) {
    this.state = {};
    this.props = props;
  }
  // 调用 setState 更新视图
  setState( stateChange ) {
    // 将修改合并到state
    Object.assign( this.state, stateChange );
    renderComponent( this );
  }
}
```
## 计数器小例子
```js
// /src/main.js
import React from '../core/react'
import ReactDom from '../core/react-dom'

function Home () {
  return <h1>Home Component</h1>
}

class App extends React.Component {
  constructor(props) {
    super()
    this.state = {
      count: 0
    }
  }

  render() {
    const add = () => {
      this.setState({
        count: this.state.count + 1
      })
    }
    return (
      <div>
        <Home />
        <div>{this.state.count}</div>
        <button onClick={add}>+1</button>
      </div>
    )
  }
}

ReactDom.render(
  <App />,
  document.getElementById("app")
)
```
# diff 算法
见 [diff算法](/react/ireact/core/diff.js)
修改渲染时的逻辑 react-dom 中 renderComponent 函数
```js
// /core/react-dom.js
renderComponent() {
  // .. .
  base = diff(component.base, renderer);
  // 注释掉以下
  // if ( component.base && component.base.parentNode ) {
  //     component.base.parentNode.replaceChild( base, component.base );
  // }
  //...
}
```
# 异步 setState
在 react 中 Component 中，每次 setState 都会立即渲染视图，需要对其做优化。


# 参考
https://github.com/hujiulong/blog/issues/4\
https://reactjs.org/docs/getting-started.html