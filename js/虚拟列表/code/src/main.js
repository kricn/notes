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

const item = document.querySelector('.item')
const phantom = document.querySelector('.phontom')
const container = document.querySelector('.container')





