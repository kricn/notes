import './assets/scss/index.scss'
import './assets/scss/style.scss'

const getData = (count=100) => {
  let res = []
  for (let i = 0; i < count; i ++) {
    res.push({
      label: i + Math.random() * 10,
      value: i
    })
  }
  return res
}

const data = getData()

let start = 0
let end = 0
let count = 0
let showData = []

const items = document.querySelectorAll('.item')
const phantom = document.querySelector('.phantom')
const list = document.querySelector('.list')
const container = document.querySelector('.container')
const size = 60
const listHeight = Math.ceil(data.length * size)

phantom.style.height = listHeight + 'px'
items.forEach(item => item.style.height = size + 'px')
count = Math.ceil(container.offsetHeight / size)
showData = data.slice(start, Math.min(end, data.length))

container.addEventListener('scroll', () => {
  let scrollTop = container.scrollTop
  start = Math.floor(scrollTop / size)
  end = start + count
  showData = data.slice(start, Math.min(end, data.length))
  let offsetTop = scrollTop - (scrollTop % size)
  list.style.transform = `translate3d(0, ${offsetTop}px, 0)`
  for (let i = 0; i < showData.length; i ++) {
    items[i].innerHTML = showData[i].label
  }
})





