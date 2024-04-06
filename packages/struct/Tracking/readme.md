# 11.前端性能优化 | 埋点专题



https://web.dev/articles/optimize-lcp?hl=zh-cn



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



