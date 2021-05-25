import { Vue } from '../core/mvue'
import { Observe } from '../core/observer.js'
let data = {
  age: 18,
  name: 'tom',
}

// new Observe(data)

// data.age
setTimeout(() => {
  data.age = 20
}, 2000)

const app = document.getElementById('app')

new Vue({
  data,
  el: app
})

function plusOne() {
  data.age ++
}

const btn = document.getElementById('plugs')
btn.onclick = plusOne

