# 10.Immer

## 10.1.为什么需要Immer

JavaScript里面有两个大类型，`引用类型`和`值类型`。由于前者的 `特性`，在我们处理数据的时候会有不确定的数据引用。这个对咱们代码的鲁棒性是致命了。举一个例子

咱们的工具库里面有一个存储变量的代码

**env.js** 

```ts
export const env = {
    id:5,
    name:"anroid"
}
```

**主文件**

```ts
import {env} from "./env.js"
let last  = {
    id:1,
    data:env
}
console.log(JSON.stringify(last))
env.data = "我变了"
console.log(JSON.stringify(last))
```

**输出结果如下**:

```ts
{"id":1,"data":{"id":5,"name":"test"}}
{"id":1,"data":{"id":5,"name":"test","data":"我变了"}}
```

 按照我们的 直觉来说，`last  `和 `env ` 应该是两个 变量，但是现在   改变 `env`的 值 `last`的值也会发生变化



## 10.2.目前的 不可变数据方案

- **immer**: Proxy 来进行对数据操作的拦截实现，
- **Immutable.js**:将原生数据类型都转化为 immutable-js 内部对象.结构共享.如果对象树中的一个节点改变，只修改这个节点和受它影响的父节点，其他节点共享。







## 10.3.immer 原理

### 10.3.1 immer 基本使用

- 旧的数据是全等的
- 但是新的数据不是全等的

```ts
import produce from "immer"

const state = [
    { label: "HTML", info: { desc: "超文本标记语言" } },
];
// 第一个参数是 旧参数
// 第二个参数是 新参数
const state1 = produce(state, draft => { 
    draft.push({ label: "ES5", info: { desc: "基于原型和头等函数的多范式高级解释型编程语言" } });
})

console.log(state === state1) // false

```

看到上面的使用方式我们不难知道 immer 的 原理就是 对 `draft` 进行了监听

**`draft` 是 `state` 的代理，对 `draft` mutable 的修改都会流入到自定义 `setter` 函数，它并不修改原始对象的值，而是递归父级不断浅拷贝，最终返回新的顶层对象，作为 `produce` 函数的返回值。**



### 10.3.2 初次代理

可以添加 一些对象 优化 运行效率

- modified, // 是否被修改过

- finalized, // 是否已经完成（所有 setter 执行完，并且已经生成了 copy）

- parent, // 父级对象

- base, // 原始对象（也就是 obj）

- copy, // base（也就是 obj）的浅拷贝，使用 Object.assign(Object.create(null), obj) 实现

- proxies, // 存储每个 propertyKey 的代理对象，采用懒初始化策略
  



### 10.3.3 getter

为了解决 对 `draft.a.x` 的 访问的问题。getter内部会在属性被访问的时候生成代理对象





### 10.3.4 setter

```shell
当对 draft 修改时，会对 base 也就是原始值进行浅拷贝，保存到 copy 属性，同时将 modified 属性设置为 true。这样就完成了最重要的 Immutable 过程，而且浅拷贝并不是很消耗性能，加上是按需浅拷贝，因此 Immer 的性能还可以。
```























