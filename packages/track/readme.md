# 11.前端性能优化 | 埋点专题



https://web.dev/articles/optimize-lcp?hl=zh-cn



被catch 的 监控不到

- 如果我们使用了脚本代码压缩，然而我们又不想将sourcemap文件发布到线上，我们怎么捕获到错误的具体信息？

- CSS文件中也存在引用资源，@font-face, background-image ...等这些请求错误该如何进行错误捕获？

- 如何保证大家提交的代码是符合预期的？ 如何了解前端项目的运行是否正常，是否存在错误？

  代码质量体系控制和错误监控以及性能分析

- 如果用户使用网页，发现白屏，现在联系上了你们，你们会向他询问什么信息呢？先想一下为什么会白屏？

  - 用户没打开网络
  - DNS域名劫持
  - http劫持
  - cdn或是其他资源文件访问出错
  - 服务器错误
  - 前端代码错误
  - 前端兼容性问题
  - 用户操作出错

  





可以考虑 无侵入的检测机制，例如 用图像识别来自动确认网页是否加载成功



## 11.1 指标



Core Web Vitals：衡量网站是否运行正常的基本指标。一组三个指标.用A/B 测试来衡量最后的影响

- LCP:加载性能
- CLS:视觉稳定性 ，Cumulative Layout Shift 
- INP：响应速度  取代了 Fid （inp包含了鼠标的键盘）

案例：

- [Vodafone（意大利）将 LCP 提升了](https://web.dev/case-studies/vodafone?hl=zh-cn) **31%**，**销售额提高了 8%**
- 

### 11.1.1 LCP



#### 11.1.1.1 概述

HTTP Archive的2022 Web Almanac ， 72%72% 的移动页面将图像作为 LCP 元素，这意味着对于大多数网站来说，要优化 LCP，他们需要确保这些图像可以快速加载

为了提供良好的用户体验，**网站在至少 75% 的网页访问中的 LCP 不得超过 2.5 秒。**

#### 11.1.1.2 思路

- 消除资源加载延迟：把lcp放在一开始加载

-  消除元素渲染延迟

-  缩短资源加载时间

  - 带宽
  - 资源带线





#### 11.1.1.3 操作





### 11.1.2 TTI



通过单一责任原则[优化第三方脚本](https://web.dev/articles/controlling-third-party-scripts?hl=zh-cn)和构建微服务，可显著减少 TTI 和 TBT





## 11.2 优化方向





### 11.2.1 谷歌





#### 11.2.1.1 devtool | performance monitor | 数据 + dom 粗略分析

直接可以看到的，没啥好说的

- cpu
- heap size 
- dom node ：dom节点 
  - 虚拟滚动
  - canvas
- js event listener：时间监听
  - 事件委托
- layout





#### 11.2.1.2 devtool | memory | 数据分析

我们可以关注到各个变量(object,闭包)的具体情况

- closure
- detached dom tree（dom节点没有被回收）



我们可以看到shallow size 和 和 retained size，前者是目前的总内存（不包括引用），后者是释放内存所能带来的内存空间（包括引用）。Distance 是 与root的距离。距离越大，处理和加载这个对象的时间就越长





#### 11.2.1.3  devtool | performance



跟上面的 11.2.1.1 的 有点像，这个是更加详细的时间序列图







## 11.3  工程化



### 11.3.1 定位源码

