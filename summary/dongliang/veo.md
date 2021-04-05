# 写在前面
项目是采用微服务部署，这里只是用vue做一个页面的重构，再嵌入到iframe中。
## 表单动态删减
表单需要动态变化，即维护一个生成表单的数组。而需要动态删减，则每个表单项都需要一个唯一的标识id，可以递增，也可以用uid生成。
```html
<template>
  <div>
    <button @click="submit">提交</button>
    <button @click="handleAdd">添加<button>
    <!-- arrays 就是维护的表单数组，数组每一项都包含唯一id和需要绑定的值 -->
    <template v-for="item in arrays">
      <input v-model="item.value" />
      <!-- 删减的时候需要传入id，这样才能标识删减的位置 -->
      <button @click="handleDel(item.key)">删除</button>
    </template>
  <div>
</template>
<script>
  export default {
    data() {
      return {
        total: 0,  //用来生成唯一标识id
        arrays: []
      }
    },
    methods: {
      handleAdd() {
        // id标识递增
        this.total ++
        // 添加数组
        // 数组对象结构多变，但要有一个唯一id去辨识这是哪个表单项
        this.arrays.push({
          key: this.total,
          value: ''
        })
      },
      handleDel(id) {
        // 过滤掉需要删除的id
        this.arrays = this.arrays.filter(item => item.id !== id)
      }
      submit() {
        // 处理维护的数组，按需要的方式提交
        let formatData = this.arrays.map(item => item.vale)
        // ...
      }
    }
  }
</script>
```