## vue2.x 响应式原理
vue2.x中的响应式原理是通过 Object.defineProperty 对 data 数据进行劫持，在首次获取 data 中的数据渲染视图时，开始收集视图中对 data 数据的依赖，在 data 发生变化时，通知对应视图重新渲染。涉及概念：数据劫持(Observe)，依赖收集器(Dep)，观察者(Watcher)，编译器(complier)。

## vue2.x 响应式原理流程
**上述提到的概念有可能是在同一个类中。**

1、vue 会初始化数据(这里不讨论 props, inject 等)，即对 data 数据进行劫持(new Observe(data))，并将整个 data 赋值给实例 vm(Vue实例化后的变量)

2、代理 vm 中的 data 数据，即访问 vm.a 等于访问 vm.$data.a

3、初始化编译器，对模板({{}})等进行处理，在此过种中，会读取 data 中的值。由于已经对 data 进行了劫持，在编译过程中，会先实例第一份依赖收集器，生成观察者(Watcher)，并将 Watcher 保存到依赖收集器势力的变量(是个数组)中。

4、data 中数据发生改变，此时，依赖收集器会读取所保存的观察者(观察者中就保留着以来视图，和更新视图的方法(update))，然后通知(notify)全部观察者(Watcher)去更新视图(update)

综上，依赖收集器(Dep)用来收集依赖(观察者 Watcher)并通知依赖去更新(update)，Dep 只是通知，并不处理视图更新逻辑。


