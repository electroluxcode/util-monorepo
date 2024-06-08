关于 request 请求体 的一些封装

总体结构如下

- fetchHook hook 实例化的方法
  - fetchCancel : 去除重复请求的工具方法
  - fetchRetry : 请求重试的工具方法
  - fetchStatus : 模拟实际业务中的 示例
- easyFetch 简单封装 fetch
