
import { Vector2 } from '../math/Vector2.js'

import { Object2D } from '../objects/Object2D.js'
function crtPath(
	ctx: CanvasRenderingContext2D,
	vertices: number[],
	closePath = false
) {
	const p0 = new Vector2(vertices[0], vertices[1])
	ctx.moveTo(p0.x, p0.y)
	for (let i = 2, len = vertices.length; i < len; i += 2) {
		const pn = new Vector2(vertices[i], vertices[i + 1])
		ctx.lineTo(pn.x, pn.y)
	}
	closePath && ctx.closePath()
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
    new Point(0, 0), new Point(14, 14), new Point(6, 14),
    new Point(0, 20),
];

// 计算旋转后的坐标点
const rotatedPoints = originalPoints.map(point => rotatePoint(point, rotationAngle));

type MyShapeType = {
	fillStyle?: string
	strokeStyle?: string
	mousePos?: Vector2
	center?: Vector2
	vertives?: number[]
	moveVertices?: number[]
	rotateVertices?: number[]
	scaleVertices?: number[]
}

class MyShape extends Object2D  {
	// 鼠标位置
	mousePos = new Vector2()
	// 图案中心位
	center = new Vector2()
	// 图案边框的顶点集合
	vertives: number[] = []

	// 移动图案
	moveVertices: number[] = [0, 0, 14, 14, 6, 14, 0, 20]

	// 旋转上面的图案
	roVertices: any[] = rotatedPoints.map(point => [point.x.toFixed(2), point.y.toFixed(2)]).flat(3)
	fillStyle = '#000'
	strokeStyle = '#fff'

	constructor(attr: MyShapeType = {}) {
		super()
		Object.assign(this, attr)
	}
	
	// 重要:设置移动状态
	move(ctx: CanvasRenderingContext2D) {
		ctx.beginPath()
		// console.log(this.roVertices)
		crtPath(ctx, this.roVertices, true)
	}

	drawShape(ctx: CanvasRenderingContext2D) {
		const { mousePos, fillStyle, strokeStyle } = this
		ctx.save()
		ctx.fillStyle = fillStyle
		ctx.strokeStyle = strokeStyle
		ctx.lineWidth = 5
		ctx.translate(mousePos.x, mousePos.y)
		this["move"](ctx)
		ctx.stroke()
		ctx.fill()
		ctx.restore()
	}
}

export { MyShape }
