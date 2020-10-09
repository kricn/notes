## 盒子模型
我们可以把html元素看成是一个个“盒子”，这个“盒子”有宽(width), 有高(height), 有内容(content), 有边框(border),
有内边距(padding), 外边距(margin)等属性。在html文档流中，通过对一个个盒子的定义和排列，组成我们所看到的html页面。\
**盒子模型的分类**\
盒子模型分为IE盒子模型和标准W3C盒子模型。两个模型的区别在于，
IE盒子模型的内容大小包含了边框(border)和内边距(padding),即其宽度为左右边框(border-left, border-right), 
左右边距(padding-left, padding-right)及内容(content)相加，而标准W3C盒子模型的内容大小
则不包含边框(border)和内边距(padding), 仅仅只是内容(content)的大小。\
可以通过css属性：box-sizing来指定盒子模型的标准。
```css
box-sizing: content-box; /*标准盒子模型，其width属性仅仅只是内容的宽度，即标准W3C盒子模型*/
box-sizing: border-box; /*IE盒子模型*/
```
**块级盒子和内联盒子**\
块级盒子（块级元素）：每个盒子都会单独占一行，默认情况下与父元素同宽，可以通过width和height属性设置，其宽高，
即使其宽小于父元素的宽度，其依然占一行。内外边距和边框会推开周围的元素。常见的块级盒子有：div, h1-h6, ul, li, 
ol, dl, dd, table, menu, header, section, footer等。\
行内盒子（行内元素）：盒子不会产生换行，设置width和height属性无效。设置垂直方向的内外边距和边框会生效但不会推开
其周围的行内盒子（高度可以用line-height及间接修改），
而设置水平方向上的有效且会推开周围的行内盒子。常见的内联盒子有：span, img, a, label, input, i,
textarea, select, button(这个默认状态下是inline-block)。
## 块级格式化上下文(BFC)
BFC会形成一个独立的渲染区域，形成BFC的盒子，其内部的布局独立存在，不影响BFC盒子外部盒子的布局。整个html标签即是一个BFC盒子。
**BFC特点**\
1、BFC盒子里块元素会垂直排列，默认宽度和BFC盒子一样宽\
2、BFC内垂直方向上的外边距(margin)会重叠，及外边距塌陷，以最大的外边距为准\
3、BFC不会被浮动元素覆盖(通常用来自适应布局，浮动元素后跟一个bfc元素)
```html
<!-- 自适应布局 -->
<div class="aside"></div>
<div class="main"></div>
<style>
html, body {
  height: 100%;
}
.aside {
  width: 200px;
  height: 100%;
  float: left
}
.main {
  overflow: hidden;
  height: 100%;
}
</style>
```
**触发BFC**\
float不为none\
overflow不为visible\
display为table-cell, table-caption, inline-block中的任何一个\
position不为relative和static
