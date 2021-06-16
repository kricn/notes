import API from './utils/api.js'

const btn = document.querySelector('#btn')
const re_btn = document.querySelector('#re_btn')

btn.addEventListener('click', function () {
  API.request({
    url: '/repeat',
  }).then(res => {
    console.log(res)
  })
})

re_btn.addEventListener('click', function () {
  API.request({
    url: '/app'
  }).then(res => {
    console.log(res)
  })
})

console.log('hello world')