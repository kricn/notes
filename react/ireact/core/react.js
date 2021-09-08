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
  setState( stateChange ) {
    // 将修改合并到state
    Object.assign( this.state, stateChange );
    renderComponent( this );
  }
}

export default { 
  createElement ,
  Component
}