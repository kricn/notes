## 二叉树
二叉树，根节点算第 0 层\
常用公式：\
1.第n层的节点数最多为2^n个节点\
2.n层二叉树最多有2^0+...+2^n=2^(n+1)-1个节点\
3.一个节点的孩子节点：2n、2n+1\
```js
// 节点类
class Node {
  constructor(data, left, right) {
    this.data = data
    this.left = left
    this.right = right
  }
  show() {
    console.log(this.data)
    return this.data
  }
}
// 二叉树类
class Tree() {
  constructor() {
    this.root = null
  }
  // 插入节点
  insert(data) {
    let node = new Node(data, null, null);
    if (!this.root) {
        this.root = node;
        return;
    }
    // 保留 root 节点
    let current = this.root;
    let parent = null;
    while (current) {
      parent = current;
      // 插入小于当前值，向左遍历
      if (data < parent.data) {
        current = current.left;
        if (!current) {
            parent.left = node;
            return;
        }
      } else {
        current = current.right;
        if (!current) {
            parent.right = node;
            return;
        }
      }
    }
  },
  // 前序遍历
  preOrder(node) {
    if (node) {
      node.show();
      this.preOrder(node.left);
      this.preOrder(node.right);
    }
  }
  // 中序遍历
  middleOrder(node) {
    if (node) {
      this.middleOrder(node.left);
      node.show();
      this.middleOrder(node.right);
    }
  }
  // 后续遍历
  laterOrder(node) {
    if (node) {
      this.laterOrder(node.left);
      this.laterOrder(node.right);
      node.show();
    }
  }
  // 获取最小值
  getMin() {
    let current = this.root;
    while(current){
      if(!current.left){
        return current;
      }
      current = current.left;
    }
  }
  // 获取最大值
  getMax() {
    let current = this.root;
    while(current){
      if(!current.right){
        return current;
      }
      current = current.right;
    }
  }
  // 获取深度
  getDeep(node,deep) {
    deep = deep || 0;
    if(node == null){
      return deep;
    }
    deep++;
    let dleft = this.getDeep(node.left,deep);
    let dright = this.getDeep(node.right,deep);
    return Math.max(dleft,dright);
  },
  // 获取某个节点
  getNode(data, node) {
    if (node) {
      if (data === node.data) {
        return node;
      } else if (data < node.data) {
        return this.getNode(data,node.left);
      } else {
        return this.getNode(data,node.right);
      }
    } else {
      return null;
    }
  }
  // 前序遍历（迭代法）
  function preorderTraversal(root) {
    const result = []
    const stack = []
    let current = root
    while(current || stack.length > 0) {
      while(current) {
        // 每拿一个节点记录一次结果，并入栈
        result.push(current.data)
        stack.push(current)
        current = current.left
      }
      // 到最底部，读出节点，以右边节点开始，重复
      current = stack.pop()
      current = current.right
    }
    return result
  }
  // 中序遍历（迭代法）
  function inorderTraversal(root) {
    const result = [];
    const stack = [];
    let current = root;
    while (current || stack.length > 0) {
      // 从根节点开始，先拿左边的节点
      while (current) {
        stack.push(current);
        current = current.left;
      }
      // 到最底部，读出节点，以右边节点开始，重复
      current = stack.pop();
      result.push(current.val);
      current = current.right;
    }
    return result;
  }
  // 后续遍历（迭代法）
  function postorderTraversal (root) {
    const result = [];
    const stack = [];
    let last = null; // 标记上一个访问的节点
    let current = root;
    while (current || stack.length > 0) {
      while (current) {
        stack.push(current);
        current = current.left;
      }
      // 这里不能用 current.pop()
      // 因为要通过 current 去找相邻的右节点
      current = stack[stack.length - 1];
      if (!current.right || current.right == last) {
        // 没有右节点或已经访问过，可以弹出，弹出后下次则往上遍历
        current = stack.pop();
        result.push(current.data);
        last = current;
        current = null; // 继续弹栈
      } else {
        current = current.right;
      }
    }
    return result;
  }
}
```