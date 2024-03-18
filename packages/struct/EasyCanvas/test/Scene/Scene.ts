import { Scene } from '../../core/Scene.js';
import { Vector2 } from '../../math/Vector2.js';
import { Img2D } from '../../objects/Img2D.js';

// step1:基本参数初始化
let size = {
  width: 300,
  height: 300,
};
const canvas = document.querySelector('canvas')!;
canvas.width = size.width;
canvas.height = size.height;
const ctx = canvas?.getContext('2d')!;

// step2:scene 重要：
// 2.1 图层 new 出来之后 img setoption 之后交给 交给 scene.add。他是不用 调用 draw方法的，因为scene会自动调用
// 基础图层(image 的基本操作)
const scene = new Scene();

const image = new Image();
image.src = '../img.png';
const pattern = new Img2D({ image });
scene.add(pattern);
image.addEventListener('load', () => {
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

// 2.2 设置scene下面自带的一个相机
// 正数是往左上角移动.因为是 相机移动嘛.相机是 右下移动，相对的物体就向着左上角移动
// scene.camera.position.set(30,30)

// 2.3 初始化鼠标裁剪
const mouseClipPos = new Vector2(Infinity);

function test(canvas: HTMLCanvasElement) {
  /* 相机位移测试 */
  // scene.camera.position.set(0, 100)
  /* 记录鼠标的裁剪坐标位 */
  // 用 clientX 是因为 这个属性不会考虑到滚动
  canvas.addEventListener('mousemove', ({ clientX, clientY }) => {
    // 转化成 以中心作为基础点的坐标
    mouseClipPos.copy(scene.clientToClip(clientX, clientY));
  });
  /* 动画 */
  ani();
}

function ani(time = 0) {
  /* 相机缩放测试 */
  const inter = (Math.sin(time * 0.002) + 1) / 2;
  scene.camera.zoom = inter + 1;
  /* 投影 */
  // pattern.style.shadowOffsetY = 80 * (1 - inter)
  // pattern.style.shadowBlur = 10 * (1 - inter)
  /* 选择测试 */

  // 原理 :pattern.pvmoMatrix 的边界从偏移坐标系变成裁剪坐标系
  // 1 和 3 是 同一个东西。 2 就是 当前的 裁剪坐标系
  // MD 加上这个之后，一直会出现原本的 path

  /* 渲染 */
  // scene.children.forEach((e)=>{
  //     e.crtPath(ctx,e.matrix)
  // })

  // 为什么这里的image图层ctxpath不会渲染的原因是 ctx 不在同一个画布了
  // scene render的时候会自动把 目标放在中间
  scene.render();

  // 这里的第三个为什么可以手动传入，因为 img本身 的 pvm 矩阵没有位移，是 scene本身位移导致了 img居中，所以需要  mouseClipPos 先进行复位
  // console.log("pattern.pvmoMatrix:",pattern.pvmoMatrix)
  if (scene.isPointInObj(pattern, mouseClipPos, pattern.pvmoMatrix)) {
    pattern.rotate += 0.02;
  }

  requestAnimationFrame(() => {
    ani(time + 15);
  });
}

if (canvas) {
  scene.setOption({ canvas });
  image.onload = function () {
    test(canvas);
  };
}
