export type BasicStyleType = {
	// 投影相关
	shadowColor?: string | undefined
	shadowBlur?: number
	shadowOffsetX?: number
	shadowOffsetY?: number

	// 全局透明度
	globalAlpha?: number | undefined

	//合成相关
	globalCompositeOperation?: GlobalCompositeOperation | undefined

	// 裁剪
	clip?: boolean

	// 滤镜
	filter?:any
}

class BasicStyle {
	// 投影相关
	shadowColor: string | undefined
	shadowBlur = 0
	shadowOffsetX = 0
	shadowOffsetY = 0

	// 全局透明度
	globalAlpha: number | undefined

	//合成相关
	globalCompositeOperation: GlobalCompositeOperation | undefined

	// 裁剪
	clip = false

	// 滤镜
	filter = ""
	/* 设置样式 */
	setOption(attr: BasicStyleType = {}) {
		Object.assign(this, attr)
	}

	/* 应用样式 */
	apply(ctx: CanvasRenderingContext2D) {
		const {
			globalAlpha,
			globalCompositeOperation,
			shadowColor,
			shadowBlur,
			shadowOffsetX,
			shadowOffsetY,
			clip,
			filter
		} = this

		/* 投影 */
		if (shadowColor) {
			ctx.shadowColor = shadowColor
			ctx.shadowBlur = shadowBlur
			ctx.shadowOffsetX = shadowOffsetX
			ctx.shadowOffsetY = shadowOffsetY
		}

		/* 全局合成 */
		globalCompositeOperation &&
			(ctx.globalCompositeOperation = globalCompositeOperation)

		/*透明度合成*/
		globalAlpha !== undefined && (ctx.globalAlpha = globalAlpha)

		// ctx
		ctx.filter = filter
		/* 裁剪 */
		clip && ctx.clip()
	}
}
export { BasicStyle }
