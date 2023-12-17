## 核心原理

本地矩阵 * 相机矩阵 * 偏移矩阵  


### Camera

- 如果单独调用的话核心就 这两行代码

```ts
const camera = new Camera(10, 0, 1)
camera.transformInvert(ctx)

```

- 如果要组合做一些工程化的东西,得到矩阵然后用矩阵去做变化就好了

```ts
const camera = new Camera(10, 0, 1)
const pvMatrix = camera.pvMatrix

```

### img 

- setoption。
- ctxpath 是 先


### 



## 前后更新内容

- object2d 后续 添加了 边界 boundingBox（和边界检测接口）| offset | uuid 和 decomposeModelMatrix （矩阵分解position rotate scale 里面）
- 添加了 scene 绘制 img 的边界的能力(手动控制stroke)。 
- 添加了 img 添加 filter 的 能力。






## 工程化使用示例

### 图像编辑(简单加滤镜)

只需要 用到 image 就可以了.

见 canvas/test/img



