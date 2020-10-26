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
}
```


