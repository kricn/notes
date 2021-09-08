import { Component } from './react'
import { diff } from './diff'

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

// 设置属性
export function setAttribute( dom, name, value ) {
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

// 创建组件
export function createComponent( component, props ) {

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
export function setComponentProps( component, props ) {
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
  base = diff(component.base, renderer);
  // base = _render( renderer );

  // 非第一次更新
  if ( component.base ) {
      if ( component.componentDidUpdate ) component.componentDidUpdate();
  } else if ( component.componentDidMount ) {
    // 第一次更新
      component.componentDidMount();
  }

  // 全部更新为新的 html ，没有用到 diff 算法
  // 通过 html 替换实现
  // if ( component.base && component.base.parentNode ) {
  //     component.base.parentNode.replaceChild( base, component.base );
  // }

  // 更新挂载在组件上的 html 节点
  component.base = base;
  // 保存组件属性
  base._component = component;

}

// 卸载组件
export function unmountComponent(component) {
  if (component.componentWillUnmount) component.componentWillUnmount();
  removeNode(component.base);
}


export default {
  render: ( vnode, container ) => {
      container.innerHTML = '';
      return render( vnode, container );
  }
}