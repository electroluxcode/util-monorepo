import { Vector2 } from '../../math/Vector2.js';
import { Group } from '../../core/Group.js';
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

// step2:新建 src
const images: HTMLImageElement[] = [];
for (let i = 1; i < 5; i++) {
  const image = new Image();
  image.src = `./vue copy ${i}.svg`;
  images.push(image);
}

const group = new Group();

function ImagePromises(images: HTMLImageElement[]) {
  return images.map((image) => ImagePromise(image));
}
function ImagePromise(image: HTMLImageElement) {
  return new Promise<HTMLImageElement>((resolve) => {
    image.onload = () => {
      resolve(image);
    };
  });
}
// step3:开始 渲染,
// 重要：这里面主要有一个 add方法
// group 里面 可以几种 draw
function onMount() {
  group.add(
    ...images.map((image, i) => {
      return new Img2D({
        image,
        position: new Vector2(200, 80 * i + 50),
        size: new Vector2(image.width, image.height).multiplyScalar(0.3),
        style: {
          shadowColor: 'rgba(0,0,0,0.5)',
          shadowBlur: 2,
          shadowOffsetY: 10,
        },
      });
    }),
  );
  group.draw(ctx);
}
Promise.all(ImagePromises(images)).then(() => {
  onMount();
});
