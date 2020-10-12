## css选择器分类
```
1.id选择器（#myid）
2.类选择器（.myclassname）
3.标签选择器（div,h1,p）
4.相邻选择器（h1+p）
5.子选择器（ul > li）
6.后代选择器（li a）
7.通配符选择器（*）
8.属性选择器（a[rel="external"]）
9.伪类选择器（a:hover, li:nth-child）
```
以上选择器的效率由高到低（其实id选择器和类选择器的效率差不多）
## 选择器的优先级
一般的，选择器指向越准确，其优先级越高\
属性里加了!important的优先级最高\
其次是行内样式\
之后是指向性越准确的优先级越高\
id选择器 > 类选择器 > 标签选择器
```html
.box {background: #000 !important}
<div class="box" style="background: #eaeaea"></div>
<!--黑色-->
```
一般查找一些嵌套深的元素，用类选择器\
如果是查找某元素下有大量相同元素且其样式相同，可以用类选择器加标签选择器, 如ul下的li，table下的tr，td等
```
.list li { color: #eaeaea }
```
## css性能
1、避免使用优先级低的选择器去限制优先级高的选择器
```
BAD
.box#item
WELL
#item
BAD
div.box
WELL
.box
```
2、避免多层标签选择器, 而是用类选择器替换
```
BAD
.box table tr td
WELL
.tdItem
```
3、避免后代选择器（同上）
4、避免继承
```
BAD
#imageBox > .box {width: 100%; height: 100%}
WELL
#imageBox {width: 100%; height: 100%}
```
## css伪类
:any-link —— 可以匹配任何的超链接\
:link —— 还没有访问过的超链接\
:link :visited —— 匹配所有被访问过的超链接\
:hover —— 鼠标移入触发\
:active —— 只对超链接生效的，点击当前的链接触发\
:focus —— 元素获得焦点，一般是用在input\
:target —— 当a标签跳转到指定target是激活\
**(a标签的样式可以按lvha的顺序重写写)**\
:empty —— 该元素是否有子元素\
:nth-child() —— 匹配父元素下的第几个子元素（child）\
:nth-last-child() —— 与 nth-child 一样，从后面开始计算\
:first-child :last-child :only-child\
**(nth-child还可以接收表达式，如3n+1, 4n+1，even, odd，匹配偶数个，奇数个，每隔3个，每隔4个)**
## css伪元素
::before\
::after\
两者在元素的前后插入一个伪元素，通过content属性定义内容，插入的伪元素会参与到排版和渲染中
## 伪元素和伪类的区别
单冒号：的是伪类，双冒号::的是伪元素，伪元素也支持单冒号写法\
区别两者关键再于有没有创建一个dom树之外的元素\
伪类基于已存在的元素，在元素处于某种状态时触发相应的动作\
伪元素创建了dom树之外的元素，其参与dom的排版和绘制

