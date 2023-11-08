mockReceiveServer

介绍

mockReceiveServer。用express搭建的测试框架 两个接口：http://localhost:8088/post | http://localhost:8088/get


数据埋点测试
```
data = ({
  name: 'Berwin2222222222222'
});

window.navigator.sendBeacon('http://localhost:8088/post',data);

```