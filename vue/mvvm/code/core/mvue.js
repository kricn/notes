import { Compiler } from "./complier"
import { Observe } from "./observe"
import { proxy } from './proxy' 

class Vue {
  constructor(options) {
    this.$options = options
    this.$data = options.data
    this.$el = options.el
    this.init()
  }

  init() {
    new Observe(this.$data)
    Object.keys(this.$data).forEach(key => {
      proxy(this, '$data', key)
    })
    new Compiler(this)
  }
}

export { Vue }