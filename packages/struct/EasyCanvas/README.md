project 文件夹下面是工程化的示例

# 1.EasyCanvas

本地矩阵 _ 相机矩阵 _ 偏移矩阵

## 1.1 Camera | 相机

### 1.1.1 单独调用

- 如果单独调用的话核心就 这两行代码

```ts
const camera = new Camera(10, 0, 1);
camera.transformInvert(ctx);
```

### 1.1.2 工程化

- 如果要组合做一些工程化的东西,得到矩阵然后用矩阵去做变化就好了

```ts
const camera = new Camera(10, 0, 1);
const pvMatrix = camera.pvMatrix;
```

用这个 pvMatrix 做 矩阵变化

## 1.2 Img | 图片

### 1.2.1 简单版

核心就是 `setoption` 和 `ctxpath `

最简单就是 下面

```ts
const image = new Image();
image.src = "./img.png";
const pattern = new Img2D({ image });
image.onload = () => {
	ctx.save();
	pattern.draw(ctx);
	ctx.restore();
};
```

### 1.2.2 复杂版

```ts
const image = new Image();
image.src = "./img.png";
const pattern = new Img2D({ image });
image.onload = () => {
	ctx.save();

	console.log(image);
	document.querySelector("img")!.setAttribute("src", "./img.png");
	// imgSize 前后都一样
	// const imgSize = new Vector2(image.width, image.height).multiplyScalar(1)
	const imgSize = new Vector2(image.width, image.height);
	pattern.setOption({
		// 旋转角度
		// rotate: 0.1,
		// 绘制的起点
		// position: new Vector2(0, 0),
		// scale: new Vector2(1),

		/* Img属性 */
		size: imgSize.clone(),
		// 指的是 起点相对于目标点的绘制 -0.5 就是对角线 也就是 x 左移图片尺寸的 50%，上移图片尺寸的50%，
		// 后续整体向着 右移动 canvas尺寸的 50% 和 下移图片尺寸的50%，就行了
		offset: imgSize.clone().multiplyScalar(-0.5),

		// 对图片进行裁剪
		// view: {
		//     x: 0,
		//     y: 0,
		//     width: image.width / 2,
		//     height: image.height / 2,
		// },

		/* 样式 */
		style: {
			// globalAlpha: 1,
			// shadowColor: 'rgba(0,0,0,0.5)',
			// shadowBlur: 5,
			// shadowOffsetY: 20,
			// filter:"contrast(200%) grayscale(80%)"
		},
	});
	ctx.translate(size.width / 2, size.height / 2);

	// draw 的时候
	// 会先进行option 上面 position, rotate, scale的操作。也就是 object2d.transform 分别调用ctx.drawImage
	// 然后通过 drawShape 分别调用ctx.drawImage
	pattern.draw(ctx);
	// 会根据 pvmoMatrix 和 width，height来进行操作
	// pattern.crtPath(ctx)
	ctx.stroke();
	ctx.restore();
};
```

## 1.3 Group | 群组

核心是 add

就是全部加载完之后

```ts
const group = new Group();
// 这里是随机分布了
group.add(
	...images.map((image, i) => {
		return new Img2D({
			image,
			position: new Vector2(200, 80 * i + 50),
			size: new Vector2(image.width, image.height).multiplyScalar(0.3),
			style: {
				shadowColor: "rgba(0,0,0,0.5)",
				shadowBlur: 2,
				shadowOffsetY: 10,
			},
		});
	})
);
group.draw(ctx);
```

## 1.4 Scene | 场景 | 重点

### 1.4.1:初始化基本的东西。

能力组合

- scene:让这个 scene 继承于 object

  - scene:单个只有 render 和赋值 canvas 的能力(get | set + let [key,value] of xx 然后赋值)

    - render
      - step1:自动清空画布
      - step2:移动到画布中心。`translate(width/2,height/2)`
      - step3:调用 carema 的 `transformInvert`
      - step4:调用 obj 的 `draw` 方法
    - 工具方法
      - isPointInObj（判断是不是在里面）:传入 img 和 鼠标位置。注意这里的鼠标位置判断又是另外一个方法了。就是先把 client 坐标变成以 canvas 画布 左上角为基点的坐标接着变成 以中间作为基点

  - object:

    - 旋转 位移 缩放 渲染顺序等基础元素
    - 定义 pvm 模型矩阵（相机矩阵 \* 偏移矩阵）
    - 定义 draw 方法 里面执行 **tranform**方法用来进行顺序的 平移旋转缩放(从 this 获取数组) 和 **drawshape**。对比一下 下面的**tranformercontroler** 的 draw 方法 是 draw 一个 **frame** 和一个 **mouseShape**
    - object2d 实例出来的 对象 需要是实现三个方法
      - pvmoMatrix | moMatrix ：就是加上了 offset：实现矩阵的重写，这里在 下面的 drawshape 的实现中是需要的
      - drawshape ：绘制图形(drawimage 之类的)
      - crtpath ：用来绑定事件 （主要是绘制 path，然后 isPointInPath 判断）
      - 有一个点需要注意，由于默认 scene 的 ctx 位置是 translate（-50，-50） 的，因此来说，我们需要给一个 offset（50%，50%）

像是 image 需要 `setOption` 将其 设置 `size` 和 `offset` 将其复位。不然位置会有变化

```ts
import { Scene } from "../../core/Scene.js";
import { Vector2 } from "../../math/Vector2.js";
import { Img2D } from "../../objects/Img2D.js";

const scene = new Scene();
const image = new Image();
image.src =
	"https://yxyy-pandora.oss-cn-beijing.aliyuncs.com/stamp-images/1.png";
const pattern = new Img2D({ image });
scene.add(pattern);

image.addEventListener("load", () => {
	ctx.save();
	const imgSize = new Vector2(image.width, image.height).multiplyScalar(0.6);
	pattern.setOption({
		/* 模型矩阵 */
		// position: new Vector2(0, -50),
		/* Img属性 */
		size: imgSize.clone(),
		offset: imgSize.clone().multiplyScalar(-0.5),
	});
});
```

### 1.4.2: 坐标和事件处理(存储中心坐标系)

初始化鼠标 `const mouseClipPos = new Vector2(Infinity)`。

用这玩意去做 事件的处理。就是在 鼠标 hover canvas 的时候 坐标 copy 一份 (过程把 client 坐标转化成 canvas 坐标)。 图片 onload 的 时候会 执行 ani

```ts
function test(canvas: HTMLCanvasElement) {
	// scene.camera.position.set(0, 100)
	/* 记录鼠标的裁剪坐标位 */
	// 用 clientX 是因为 这个属性不会考虑到滚动
	canvas.addEventListener("mousemove", ({ clientX, clientY }) => {
		// 转化成 以中心作为基础点的坐标
		mouseClipPos.copy(scene.clientToClip(clientX, clientY));
	});
	/* 动画 */
	ani();
}
```

### 1.4.3 执行动画帧(通过 isPointInObj 进行判断)

根据偏移矩阵画出 `path` (moveto,lineto)后 通过 `ctx.isPointInPath(mp.x, mp.y)` 进行判断

```ts
scene.setOption({ canvas });
scene.render();

// 第一个参数是目标，第二个参数是 鼠标位置，第三个参数是 偏移矩阵。注意这里的pvmoMatrix 是中心点 加上   左右和缩放
if (scene.isPointInObj(pattern, mouseClipPos, pattern.pvmoMatrix)) {
	pattern.rotate += 0.02;
}
requestAnimationFrame(() => {
	ani(time + 15);
});
```

## 1.7 Text2d | 文字

## 1.8 OrbitControler | 相机控制(可以直接用)

需要 `Scene`,`img2D`,`OrbitControler`

### 1.8.1 新建 scene 和 orbitcontroler，scene 的 相机放进 orbitcontroler

```ts
// scene 里面自带了一个相机
const scene = new Scene();
const orbitControler = new OrbitControler(scene.camera);

const image = new Image();
image.src = "../img.png";
const pattern = new Img2D({ image });

scene.add(pattern);
scene.setOption({ canvas });
```

### 1.8.2 image 加载后就可以 在 canvas 上面 render 和 添加事件

这里 其实是 从 this 拿到 相机 然后 做位移变化

```ts
image.onload = function () {
	/* 监听wheel和pointer 的渲染，默认定义了change事件 */
	orbitControler.on("change", () => {
		scene.render();
	});

	/* 滑动滚轮缩放，doScale的时候会触发change事件  */
	canvas.addEventListener("wheel", ({ deltaY }) => {
		orbitControler.doScale(deltaY);
	});

	/* 按住滚轮平移 */
	canvas.addEventListener("pointerdown", (event: PointerEvent) => {
		if (event.button == 0) {
			orbitControler.pointerdown(event.clientX, event.clientY);
		}
	});
	canvas.addEventListener("pointermove", (event: PointerEvent) => {
		orbitControler.pointermove(event.clientX, event.clientY);
	});
	window.addEventListener("pointerup", (event: PointerEvent) => {
		if (event.button == 0) {
			orbitControler.pointerup();
		}
	});
	/* 渲染 */
	scene.render();
};
```

## 1.9 ShapeController | 图像控制 | 多个图像控制

里面集成 了 `ImgTransformer` 和 `Frame` 和 `MouseShap`

### 1.9.1 初始化(重要)

- **新建 scene | 新建 orbitcontrol(传参传入 scene.camera) | 新建 imgcontrol | 新建 group**

- **scene.add(imgcontrol)**

- **imgGroup.add(new img2d()) | scene.add(imgGroup)** imgGroup 是 object 2d[] .就是 new Image 后放进去的

- **scene.setOption({ canvas })** : 初始化画布

### 1.9.2 canvas 事件点击 img 逻辑

- 就是将 group 的 children 给到 scene 的 isPointInObj 去 判断

```ts
imgControler.on('change', () => {
    scene.render()
})
function selectObj(imgGroup: Object2D[], mp: Vector2): Img2D | null {
	// 选择次序问题,可以简单忽略
    for (let img of [...imgGroup]) {
        if (img instanceof Img2D && scene.isPointInObj(img, mp, img.pvmoMatrix)) {
            return img
        }
    }
    return null
}
 canvas.addEventListener('pointerdown', (event: PointerEvent) => {
   	  const { button, clientX, clientY } = event
      switch button{
          case 0 :
               imgHover = selectObj(imgGroup.children, mp)
			  console.log("imgHover:",imgHover?.name )
               break
      }
 })
```

### 1.9.3 Frame | 绘制外框

#### 1.9.3.1 如何定义

初始化的时候什么都不用加，最重要的是绘制样式。分成三步绘制

- 绘制 线
- 绘制 点
- 绘制中点

代码方面几个步骤

- 定义 `updateShape` 方法 用来更新 图形的各个顶点的 array
- 定义 `getMouseState` 用来计算 鼠标 和 上面顶点的 差值 () .注意 这里需要 设置 变换的 基点（opposite.set）。以后要用。最后说一下判定的规则，主要是通过`isPointInStroke` 和 对象距离的比较来确定 目前的 鼠标是 边边 还是中间什么的
- 最后一步最好需要分成两个维度。绘制
  - 第一个维度是可以直接用的。这一步，我们可以尝试重写 draw 方法。然后在我们需要的时候手动传入 ctx 进行调用就好了
  - 第二个维度是用来工程化的

#### 1.9.3.2 事件处理

判断是否 在 frame 上面(getMouseState)

- scale 各个对角线里面一点(遍历角点 ，判断自己 vector2 里面的 length 对角线方法 )
- scalex （ctx.isPointInStroke(mp.x, mp.y)）
- scaley（ctx.isPointInStroke(mp.x, mp.y)）
- 移动
- 旋转 各个对角线外面一点
- null

#### 1.9.3.2 如何使用

在 shapeControler.ts 的 draw 方法 中 直接使用

```ts
frame.draw(ctx);
```

然后等着 shapeControler 调用。

### 1.9.4 mouseShape | 绘制鼠标 图案

- 定义 缩放 样式

- 定义 平移 样式

- 定义 移动 样式

### 1.9.5 ShapeTransformer

Controler 的具体操作步骤如下：

1. 当选中图案时：
   - 把图案传递给 imgTransformer。
   - 把图案的变换信息存储到 controlState 中，以便按下 Esc 时取消变换。
2. 当鼠标按下时：
   - 记录图案控制状态。
   - 更新鼠标在图案父级坐标系里的坐标位。
3. 当控制状态 controlState 发生改变时：
   - 暂存变换数据
     - clipCenter 图案在裁剪坐标系中的中点。
     - clipOpposite 裁剪坐标系里的对点，作为默认缩放的基点。
     - parentPvmInvert 图案父级 pvm 矩阵的逆矩阵，用于将裁剪坐标位转图案父级坐标位。
     - 把图案变换信息和鼠标位置更新到 imgTransformer 中。
   - 根据控制状态更新图案变换基点 origin。
     - 缩放：默认基点在对面，按住 alt 键时，在图案中心。
     - 旋转：基点在图案中心。
   - 根据变换基点，偏移图案。
4. 鼠标移动时：
   - 更新鼠标在图案父级坐标系中的位置（**relativeTransform 这个方法会 number("scale"+xx) 之类的触发-pointermove** ）
   - 变换图案
5. 鼠标抬起时，取消控制状态 controlState

### 1.9.6 如何使用

- 添加进场景

  ```ts
  const imgControler = new TransformControler();
  scene.add(imgControler);
  ```

- 鼠标事件

  - canvas 监听 pointerdown 并且触发 img.pointerdown(imgHover, mp)

  - canvas 监听 pointermove 并且触发 img.pointeromove(mp)

  - window 监听 pointerup 并且触发 img.pointeromove(mp)

- 键盘事件

  - keydown
    - imgControler.keydown(key, altKey, shiftKey);
  - keyup
    - imgControler.keyup(altKey, shiftKey);

### 1.9.7 难点

#### 1.9.7.1 缩放 | 位移

这里用

- 位移

  ```ts
  this.relativePosition.subVectors(dragEnd, dragStart);
  ```

- 旋转

  ```ts
  this.relativeRotate = end2Orign.angle() - start2Orign.angle();
  ```

- 缩放

  ```ts
   getRelativeScale(start2Orign: Vector2, end2Orign: Vector2) {
      const a = end2Orign.clone().rotate(-this.localRotate);
      const b = start2Orign.clone().rotate(-this.localRotate);
      return new Vector2(a.x / b.x, a.y / b.y);
    }
  ```

#### 1.9.7.3 基点位移

- 例如 我们需要图形基于一个点进行旋转，我们是需要**变化基点**然后再进行旋转。不然会有奇怪的位移 总结是 m3 * m2 *m1

  - 那么我们怎么进行变化基点，可以有以下几步

    - m1

      ```ts
      const m1 = new Matrix3().makeTranslation(-origin.x, -origin.y);
      ```

    - m2 + relative = m3

      ```ts
      const m2 = new Matrix3()
      	.scale(localScale.x * relativeScale.x, localScale.y * relativeScale.y)
      	.rotate(localRotate + relativeRotate)
      	.translate(
      		localPosition.x + relativePosition.x,
      		localPosition.y + relativePosition.y
      	);
      ```

## 1.10 Shape | scene | 自定义图形跟随鼠标

关键知识点在于

- 需要在自己 的 shape 暴露 mousePos ，并且把 这个 坐标传入进去
- shape 需要统一在 scene 中渲染，因此需要写入 shape 的 `drawShape` 方法

自定义形状（鼠标样式）旋转

- x 的 变化 是 `x cos - y sin `
- y 的变化是 `x sin + y cos`

```ts
class Point {
	constructor(public x: number, public y: number) {}
}
function rotatePoint(point: Point, angle: number): Point {
	const cosA = Math.cos(angle);
	const sinA = Math.sin(angle);
	const xPrime = point.x * cosA - point.y * sinA;
	const yPrime = point.x * sinA + point.y * cosA;
	return new Point(xPrime, yPrime);
}
// 逆时针旋转45度对应的弧度
const rotationAngle = Math.PI / 4;
// 原始坐标点 0, 0, 14, 14, 6, 14, 0, 20
const originalPoints: Point[] = [
	new Point(0, 0),
	new Point(14, 14),
	new Point(6, 14),
	new Point(0, 20),
];

// 计算旋转后的坐标点
const rotatedPoints = originalPoints.map((point) =>
	rotatePoint(point, rotationAngle)
);
```

### 1.10.1 定义 MyShape | 绘制点 | 根据 mousePos 进行绘制

主要做了这几件事

- 定义旋转方法
- 对点进行旋转 并且绘制路径
- 重写这个类的 drawShape 方法

```ts
import { Vector2 } from "../math/Vector2.js";

import { Object2D } from "./Object2D.js";
function crtPath(
	ctx: CanvasRenderingContext2D,
	vertices: number[],
	closePath = false
) {
	const p0 = new Vector2(vertices[0], vertices[1]);
	ctx.moveTo(p0.x, p0.y);
	for (let i = 2, len = vertices.length; i < len; i += 2) {
		const pn = new Vector2(vertices[i], vertices[i + 1]);
		ctx.lineTo(pn.x, pn.y);
	}
	closePath && ctx.closePath();
}

class Point {
	constructor(public x: number, public y: number) {}
}
function rotatePoint(point: Point, angle: number): Point {
	const cosA = Math.cos(angle);
	const sinA = Math.sin(angle);
	const xPrime = point.x * cosA - point.y * sinA;
	const yPrime = point.x * sinA + point.y * cosA;
	return new Point(xPrime, yPrime);
}
// 逆时针旋转45度对应的弧度
const rotationAngle = Math.PI / 4;

// 原始坐标点 0, 0, 14, 14, 6, 14, 0, 20
const originalPoints: Point[] = [
	new Point(0, 0),
	new Point(14, 14),
	new Point(6, 14),
	new Point(0, 20),
];

// 计算旋转后的坐标点
const rotatedPoints = originalPoints.map((point) =>
	rotatePoint(point, rotationAngle)
);
type MyShapeType = {
	fillStyle?: string;
	strokeStyle?: string;
	mousePos?: Vector2;
	center?: Vector2;
	vertives?: number[];
	moveVertices?: number[];
	rotateVertices?: number[];
	scaleVertices?: number[];
};

class MyShape extends Object2D {
	// 鼠标位置
	mousePos = new Vector2();
	// 图案中心位
	center = new Vector2();
	// 图案边框的顶点集合
	vertives: number[] = [];

	// 移动图案
	moveVertices: number[] = [0, 0, 14, 14, 6, 14, 0, 20];

	// 旋转上面的图案
	roVertices: any[] = rotatedPoints
		.map((point) => [point.x.toFixed(2), point.y.toFixed(2)])
		.flat(3);
	fillStyle = "#000";
	strokeStyle = "#fff";

	constructor(attr: MyShapeType = {}) {
		super();
		Object.assign(this, attr);
	}

	// 重要:设置移动状态
	move(ctx: CanvasRenderingContext2D) {
		ctx.beginPath();
		// console.log(this.roVertices)
		crtPath(ctx, this.roVertices, true);
	}

	drawShape(ctx: CanvasRenderingContext2D) {
		const { mousePos, fillStyle, strokeStyle } = this;
		ctx.save();
		ctx.fillStyle = fillStyle;
		ctx.strokeStyle = strokeStyle;
		ctx.lineWidth = 5;
		ctx.translate(mousePos.x, mousePos.y);
		this["move"](ctx);
		ctx.stroke();
		ctx.fill();
		ctx.restore();
	}
}

export { MyShape };
```

### 1.10.2 在 scene 中使用

- scene.add 添加进去然后 draw 就可以了

```ts
import { Scene } from "../../core/Scene.js";
import { MyShape } from "../../objects/MyShape.js";
import { Vector2 } from "../../math/Vector2.js";
// step1:基本参数初始化
let size = {
	width: 400,
	height: 400,
};
const canvas = document.querySelector("canvas")!;
canvas.width = size.width;
canvas.height = size.height;
const ctx = canvas?.getContext("2d")!;
const scene = new Scene();
scene.setOption({ canvas });

const mouseClipPos = new Vector2(Infinity);
let te = new MyShape({
	mousePos: mouseClipPos,
});
scene.add(te);

canvas.addEventListener("mousemove", ({ clientX, clientY }) => {
	// 转化成 以中心作为基础点的坐标
	mouseClipPos.copy(scene.clientToClip(clientX, clientY));
	te.draw(ctx);
	scene.render();
});

ani();
function ani(time = 0) {
	scene.render();
	requestAnimationFrame(() => {
		ani(time + 15);
	});
}
```

我们在变化图形的时候，需要监听两个东西

### 1.11.1 初始化

```ts
new ImgTransformer({
	mousePos: this.parentMousePos,
	orign: this.origin,
});
```

## 前后更新内容

- object2d 后续 添加了 边界 boundingBox（和边界检测接口）| offset | uuid 和 decomposeModelMatrix （矩阵分解 position rotate scale 里面）
- 添加了 scene 绘制 img 的边界的能力(手动控制 stroke)。
- 添加了 img 添加 filter 的 能力。
- 相比之前的代码，优化了逻辑结构

  - core 核心原来是 scene 和 camera。现在扩充到
    - camera
    - group
    - object
    - scene
  - style 核心集成到 object 文件下面并且去除这个文件夹
  - eventlistener 的功能 直接 添加到 object2d 和 orbitcontroller 里面
  - scene 本身是 extends group，现在是 extends object2d

## 工程化使用示例

### 图像编辑(滤镜)

只需要 用到 image 就可以了.

见 canvas/test/img
