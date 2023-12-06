"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScreenScale = void 0;
class ScreenScale {
    CurrelFixMap = document.querySelector("#app");
    CurrelFixMapLevel = '';
    resizeListener = null;
    timer = null;
    currScale = 1;
    isScreenScaleRunning = false;
    IsMapElement = false;
    options;
    /**
     * 初始化 ScreenScale 类。
     * @param options - ScreenScale 的配置选项。
     * @param isShowInitTip - 是否显示初始化消息（默认为 true）。
     */
    init(options = {}, isShowInitTip = true) {
        // step1:输出label
        if (isShowInitTip) {
            console.log(`%c` + `util_monorepo` + ` 运行中`, `color: rgba(0,0,0,0.6); ;background: linear-gradient(to right, #a1c4fd 0%, #c2e9fb 100%); padding: 8px 12px; border-radius: 4px;`);
        }
        this.options = options;
        const { dw = 1920, dh = 929, el, resize = true, ignore = [], transition = 'none', delay = 0 } = options;
        const dom = el;
        if (!dom) {
            console.error(`ScreenScale: '${el}' 不存在`);
            return;
        }
        const style = document.createElement('style');
        const ignoreStyle = document.createElement('style');
        style.lang = 'text/css';
        ignoreStyle.lang = 'text/css';
        style.id = 'ScreenScale-style';
        ignoreStyle.id = 'ignoreStyle';
        style.innerHTML = `body {overflow: hidden;}`;
        const bodyEl = document.querySelector('body');
        bodyEl.appendChild(style);
        bodyEl.appendChild(ignoreStyle);
        dom.style.height = `${dh}px`;
        dom.style.width = `${dw}px`;
        dom.style.transformOrigin = `left top`;
        setTimeout(() => {
            dom.style.transition = `${transition}s`;
        }, 0);
        dom.style.overflow = "hidden";
        this.KeepFit(dw, dh, dom, ignore);
        this.resizeListener = () => {
            if (this.timer)
                clearTimeout(this.timer);
            console.log("resize测试");
            if (delay !== 0) {
                this.KeepFit(dw, dh, dom, ignore);
                if (this.IsMapElement)
                    this.FixMap(this.CurrelFixMap, this.CurrelFixMapLevel);
            }
            else {
                this.KeepFit(dw, dh, dom, ignore);
                if (this.IsMapElement)
                    this.FixMap(this.CurrelFixMap, this.CurrelFixMapLevel);
            }
        };
        resize && window.addEventListener('resize', this.resizeListener);
        this.isScreenScaleRunning = true;
    }
    /**
     * 调整指定元素以进行缩放。一次缩放一个
     * @param el - 要调整的元素选择器。
     * @param level - 缩放级别（默认为 1）。
     */
    FixMap(el = document.querySelector("#app"), level = "1") {
        if (!this.isScreenScaleRunning) {
            console.error("尚未初始化");
        }
        if (!el) {
            console.error(`ScreenScale: 选择器错误: ${el}`);
        }
        this.CurrelFixMap = el;
        this.CurrelFixMapLevel = level;
        const currEl = el;
        if (!currEl) {
            console.error("FixMap: 未找到任何元素");
            return;
        }
        let item = el;
        if (!this.IsMapElement) {
            item.originalWidth = item.clientWidth;
            item.originalHeight = item.clientHeight;
        }
        // 得到变化尺寸
        const rectification = this.currScale === 1 ? 1 : this.currScale * Number(level);
        // console.log("rect222:",rectification);
        item.style.width = `${item.originalWidth * rectification}px`;
        item.style.height = `${item.originalHeight * rectification}px`;
        item.style.transform = `scale(${1 / this.currScale}) `;
        item.style.transformOrigin = `0 0`;
        this.IsMapElement = true;
    }
    /**
     * @des 调整大小
     * @param dw
     * @param dh
     * @param dom
     * @param ignore
     */
    KeepFit(dw, dh, dom, ignore) {
        const clientHeight = document.documentElement.clientHeight;
        const clientWidth = document.documentElement.clientWidth;
        this.currScale = clientWidth / clientHeight < dw / dh ? clientWidth / dw : clientHeight / dh;
        dom.style.height = `${clientHeight / this.currScale}px`;
        dom.style.width = `${clientWidth / this.currScale}px`;
        dom.style.transform = `scale(${this.currScale}`;
        const ignoreStyleDOM = document.querySelector('#ignoreStyle');
        ignoreStyleDOM.innerHTML = '';
        for (let item of ignore) {
            let itemEl = item.el || item.dom;
            if (typeof item === 'string')
                itemEl = item;
            if (!itemEl) {
                console.error(`ScreenScale: 选择器错误: ${itemEl}`);
                continue;
            }
            const realScale = item.scale ? item.scale : 1 / this.currScale;
            const realFontSize = realScale !== this.currScale ? item.fontSize : 'ScreenScale';
            const realWidth = realScale !== this.currScale ? item.width : 'ScreenScale';
            const realHeight = realScale !== this.currScale ? item.height : 'ScreenScale';
            const regex = new RegExp(`${itemEl}(\x20|{)`, 'gm');
            const isIgnored = regex.test(ignoreStyleDOM.innerHTML);
            if (isIgnored) {
                continue;
            }
            ignoreStyleDOM.innerHTML += `\n${itemEl} { 
          transform: scale(${realScale})!important;
          transform-origin: left top;
          width: ${realWidth}!important;
          height: ${realHeight}!important;
        }`;
            if (realFontSize) {
                ignoreStyleDOM.innerHTML += `\n${itemEl} div ,${itemEl} span,${itemEl} a,${itemEl} * {
            font-size: ${realFontSize}px;
          }`;
            }
        }
    }
}
exports.ScreenScale = ScreenScale;
exports.default = ScreenScale;
