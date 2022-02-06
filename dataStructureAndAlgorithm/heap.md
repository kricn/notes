## 堆
堆的结构像二叉树
```sh
# 数组
[6, 5, 4, 1, 4, 2, 1]
# 大根堆
      6
  5       4
1   4   2   1
```
## 堆的一些公式
第 n 个下标的左子节点 2n + 1
第 n 个下标的左子节点 2n + 2
第 n 个下标的父节点 (n - 1) / 2

## 在第 n 个下标往上形成为大根堆
```java
// 交换数组中两个数的值
public static void swap(int[] arr, int i, int j) {
  if (i == j) return ;
  arr[i] ^= arr[j];
  arr[j] ^= arr[i];
  arr[i] ^= arr[j];
}
// 某个数在index能否向上移动，形成大根堆
public static void heapInsert(int[] arr, int index) {
  // 判断是否比父节点大
  while (arr[index] > arr[(index - 1) / 2]) {
    swap(arr, index , (index - 1) / 2);
    // 更新节点位置，即更新为父节点的下标
    index = (index - 1) / 2;
  }
}
```

## 在第 n 个下标往下形成为大根堆
```java
// 交换数组中两个数的值
public static void swap(int[] arr, int i, int j) {
  if (i == j) return ;
  arr[i] ^= arr[j];
  arr[j] ^= arr[i];
  arr[i] ^= arr[j];
}
// 某个数在index位置，能否向下移动，形成大根堆
public static void heapify (int[] arr, int index, int heapSize) {
  int left = index * 2 + 1;  // 左节点下标
  while(left < heapSize) { // 还有子节点的时候
    // 比较两个子节点
    int largest = left + 1 < heapSize && arr[left + 1] > arr[left]
                    ? left + 1 : left;
    // 较大的子节点和父节点比较
    largest = arr[largest] > arr[index] ? largest : index;
    // 较大的子节点没有比父节点大，退出循环
    if (largest == index) break;
    // 交换父子节点
    swap(arr, largest, index);
    // 更新index的位置
    index = largest;
    // 更新左节点
    left = index * 2 + 1;
  }
}
```