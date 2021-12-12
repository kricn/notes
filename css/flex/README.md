# flex 布局

## 多列卡片布局（自适应）
父容器(list)定义为 flex 模式，子项目容器(item)选择铺满整个子容器，如需要分每行3列，则可以设置子容器宽度为 33.33%，item 容器给内边距，实现间隔效果，子容器内再套一个容器（item-inner）,这个容器才是真正放内空的地方，如下
```html
<div class="list>
  <div class="item">
    <div class="item-inner>
      内容 content
    </div>
  </div>
</div>
```
item 容器大小若要相等，则其左右边距的大小应该为
