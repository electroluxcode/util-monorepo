# EasyCanvas



## 1.1 更新内容

相比之前的代码，优化了逻辑结构

- core 核心原来是  scene 和 camera。现在扩充到
  - camera
  - group
  - object
  - scene
- style 核心集成到 object 文件下面并且去除这个文件夹
- eventlistener 的功能 直接 添加到 object2d 和 orbitcontroller里面







## 1.2 scene 工程化逻辑

能力组合

- scene:让这个scene继承于object
  - scene:单个只有render和赋值canvas的能力(get | set + let [key,value] of xx 然后赋值)
    - render
      - step1:自动清空画布
      - step2:移动到画布中心。`translate(width/2,height/2)`
      - step3:调用 carema 的 `transformInvert`
      - step4:调用 obj的 draw 方法
    - 工具方法
      - isPointInObj（判断是不是在里面）:传入img 和 鼠标位置。注意这里的鼠标位置判断又是另外一个方法了。就是先把client 坐标变成以canvas 画布 左上角为基点的坐标接着变成 以中间作为基点
  - object:
    - 旋转 位移 缩放 渲染顺序等基础元素
    - 定义 pvm 模型矩阵（相机矩阵 * 偏移矩阵）
    - 定义tranform方法用来进行顺序的 平移旋转缩放(从this获取树)
    - object 实例出来的 对象
      - 









