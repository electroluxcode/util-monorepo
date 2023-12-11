import { Camera } from '../../core/Camera.js'

import { Text2D } from '../../objects/Text2D.js'

// step1:基本参数初始化
let size = {
    width: 300,
    height: 300
}
const canvas = document.querySelector("canvas")!
canvas.width = size.width
canvas.height = size.height
const ctx = canvas?.getContext('2d')


// step2:相机方法的测试原理是 逆向操作 
// 对应 x y 距离  距离越短越大
const camera = new Camera(10, 0, 1)
function matrixTest(ctx) {
    ctx.save()
    camera.transformInvert(ctx)
    ctx.fillRect(0, 0, 200, 100)
    ctx.restore()
}

ctx && matrixTest(ctx)