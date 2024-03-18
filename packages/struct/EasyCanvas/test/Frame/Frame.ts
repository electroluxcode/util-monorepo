import { Scene } from '../../core/Scene.js';

// step1:基本参数初始化
let size = {
  width: 400,
  height: 400,
};
const canvas = document.querySelector('canvas')!;
canvas.width = size.width;
canvas.height = size.height;

const scene = new Scene();
