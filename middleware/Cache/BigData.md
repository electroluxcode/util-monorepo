# 性能





## Performance和Memory都可以用来定位内存问题，先用谁呢？

答案是先用Performance。

录制内存的时候如果录制结束后，看到内存的下限在不断升高的话，你就要注意了 —— 这里有可能发生了内存泄漏。

一些原则

- 尽量使用没有混淆的代码：
- 排查问题时使用production模式编译出来的代码。dev 会占用内存
- 屏蔽所有浏览器插件
- 在现场打内存快照，便于跳转到源代码所在行



## Detached DOM tree



当一个节点处于“detached”状态，表示它已经不在DOM树上了，但Javascript仍旧对它有引用，所以暂时没有被回收。通常，Detached DOM tree往往会造成内存泄漏，我们可以重点分析这部分的数据



## Shallow size | Retained size  | Distance

这些指标都是 memory 里面 输出的 table 表单

- Shallow size: 这是对象自身占用内存的大小
- Retain size：删除这个对象后释放的大小
- Distance：与root的距离。距离越大，处理和加载这个对象的时间就越长



Shallow Size = Retained Size，说明基本没怎么泄漏。而如果Retained Size > Shallow Size，就需要多加注意了





















