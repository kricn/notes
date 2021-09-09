import { renderComponent } from './react-dom'

export function createElement( tag, attrs, ...children ) {
  return {
      tag,
      attrs,
      children
  }
}

export class Component {
  constructor( props = {} ) {
    this.state = {};
    this.props = props;
  }
  setState(stateChange) {
    enqueueSetState(stateChange, this)
  }
}
// 定义更新队列
const queue = [];
// 渲染队列
const renderQueue = [];
function enqueueSetState( stateChange, component ) {
  // 如果queue的长度是0，也就是在上次flush执行之后第一次往队列里添加
  if ( queue.length === 0 ) {
      defer( flush );
  }
  queue.push( {
    stateChange,
    component
  });
  // 如果renderQueue里没有当前组件，则添加到队列中
  if ( !renderQueue.some( item => item === component ) ) {
      renderQueue.push( component );
  }
}
// 清空更新队列
function flush() {
  let item, component;
  // 遍历
  while( item = queue.shift() ) {

    const { stateChange, component } = item;

    // 如果没有prevState，则将当前的state作为初始的prevState
    if ( !component.prevState ) {
        component.prevState = Object.assign( {}, component.state );
    }

    // 如果stateChange是一个方法，也就是setState的第二种形式
    if ( typeof stateChange === 'function' ) {
        Object.assign( component.state, stateChange( component.prevState, component.props ) );
    } else {
        // 如果stateChange是一个对象，则直接合并到setState中
        // 这里的 stateChange 如果是相同的表达式如 this.state.count + 1
        // 由于 this.state.count 还没有得到更新，循环100次后还是 this.state.count + 1 也就是 0 + 1，相当于没变
        Object.assign( component.state, stateChange );
    }

    component.prevState = component.state;

  }
  // 渲染每一个组件
  while( component = renderQueue.shift() ) {
    renderComponent( component );
  }
}
// 定义延迟方法
function defer( fn ) {
  // 通过 微任务 延迟执行
  return Promise.resolve().then( fn );
}

export default { 
  createElement ,
  Component
}