## 链表(Linked-List)
链表(Linked-List)由一系列节点组成，是一种非顺序的储存结构，在内存中不需要连续的储存空间，
其里边的数据逻辑通过链表中的指针链次序实现。\
链表中每个元素都成为一个节点，节点包括值，指针（记录上[下]节点的位置）等。
## Node类
定义一个Node类，使其拥有链表节点所需要的属性。
```javascript
class Node {
  constructor(ele){
    this.ele = ele;  //节点的值
    this.next = null;  //指向下一节点的指针，默认为null, 即该节点默认是最后一个节点
  }
}
```
## LinkedList类
LinkedList类里实现链表的相关操作，包括增删查改等。
```javascript
class LinkedList {
  constructor () {
    this.head = null;
    this.length = 0;
  }
  //添加
  append(ele) {
      const node = new Node(ele)
      if (this.head === null) {
          this.head = node;
          this.tail = node;
      } else {
          let current = this.head;
          while( current.next ) {
              current = current.next
          }
          current.next = node
          this.tail = node
      }

      this.length ++;
      return true
  }

  //任意位置插入元素
  insert(ele, index) {
      //位置边界
      if (index < 0 || index > this.length) {
          throw new Error("超出位置边界")
      }
      const node = new Node(ele)
      let current = this.head
      let prev = null
      let position = 0
      if (index === 0) {
          this.head = node
          node.next = current
      } else if (index === this.length - 1) {
          current = this.tail
          this.tail = node
          current.next = this.tail
      } else {
          while (position ++ < index) {
              prev = current
              current = current.next
          }
          prev.next = node
          node.next = current
      }

      this.length ++ 
      return true
  }

  //移除元素
  removeAt(index) {
      if (index < 0 || index > this.length - 1) {
          throw new Error("超出位置边界")
      }
      let current = this.head
      let prev = null
      let position = 0
      if (index === 0) {
          this.head = current.next
      } else {
          while (position ++ < index) {
              prev = current
              current = current.next
          }
          prev.next = current.next
          if (position === this.length) {
              this.tail = prev
          }
      }
      
      this.length --
      return current.ele
  }

  //查找元素位置
  find(ele) {
      let current = this.head
      let index = -1
      let res = []
      while(current) {
          if (ele === current.ele) {
              res.push({
                  index: index + 1,
                  element: current.ele
              })
          }
          index ++
          current = current.next
      }
      return res
  }

  //删除指定元素
  remove(ele, start=0, end=this.length) {
      const indexs = this.find(ele)
      if (indexs.length === 0) {
          return "没有找到该元素"
      }
      let counts = indexs.slice(start, end)
      let res = []
      counts.forEach((item, idx) => {
          res.push({
              index: item.index,
              //移除之后长度会变短，每次下标都要在基础上减一
              element: this.removeAt(item.index - idx)
          })
      })
      return res
  }

  //判空
  isEmpty() {
      return !this.length
  }

  //打印链表
  toString() {
      if (this.head == null) {
          return ""
      }
      let current = this.head
      let str = current.ele
      while(current.next) {
          current = current.next
          str += current.ele
      }
      return str
  }
}
```


