## 功能

最近最多次数缓存(map)


- 首先是 在 new 的 时候 初始化 size 之类的东西
- 接下来 是 get 的时候 用has 判断存不存在 ，存在就fre++ 
- 最后是 在 put 的时候 用has 判断存不存在，
    - has 存在 fre++。set一下
    - 判断是否到达最大fre。用entries两层for删掉 key。
    - 最后统一初始化


## 使用方法

见 html 文件