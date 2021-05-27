import './assets/scss/index.scss'
import './assets/scss/test.scss'

import m1 from './modules/module-1';
import m2 from './modules/module-2';
import m3 from './modules/module-3'
import Vue from 'vue'
let engligh = {
  teacher: 'english', age: 47
};

m1.push(engligh);
m2.push(engligh);

console.log('hello world')