let debounce = (fn, timer) => {
    let flag;
    return function (args) {
        if (flag) {
            clearTimeout(flag);
        }
        flag = setTimeout(() => {
            fn(args);
        }, timer);
    };
};
class ScreenScale {
    CurrelFixMap = ["#app"];
    CurrelFixMapLevel = 1;
    resizeListener = null;
    timer = null;
    currScale = 1;
    isScreenScaleRunning = false;
    IsMapElement = false;
    currelRectificationIsKeepRatio = false;
    options;
    /**
     * 初始化 ScreenScale 类。
     * @param options - ScreenScale 的配置选项。
     * @param isShowInitTip - 是否显示初始化消息（默认为 true）。
     */
    init(options = {}, isShowInitTip = true) {
        // step1:输出label
        if (isShowInitTip) {
            console.log(`util_monorepo/scale:` + ` 运行中`);
        }
        let base = {
            isKeepRadio: false
        };
        this.options = Object.assign(base, options);
        const { dw = 1920, dh = 929, el, resize = true, ignore = [], transition = 'none', delay = 0 } = options;
        if (!el) {
            console.error(`ScreenScale: '${el}' 没有输入`);
            return;
        }
        const dom = document.querySelector(el);
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
        if (!this.options.isKeepRadio) {
            dom.style.transformOrigin = `left top`;
            setTimeout(() => {
                dom.style.transition = `${transition}s`;
            }, 0);
            dom.style.overflow = "hidden";
        }
        else {
            dom.style.transformOrigin = `left top`;
            setTimeout(() => {
                dom.style.transition = `${transition}s`;
            }, 0);
        }
        if (!dom) {
            console.error(`ScreenScale: '${el}' 不存在`);
            return;
        }
        this.KeepFit(dw, dh, el, ignore);
        this.resizeListener = () => {
            if (this.timer)
                clearTimeout(this.timer);
            if (delay !== 0) {
                this.KeepFit(dw, dh, el, ignore);
                if (this.IsMapElement)
                    this.FixMap(this.CurrelFixMap, this.currelRectificationIsKeepRatio, this.CurrelFixMapLevel);
            }
            else {
                this.KeepFit(dw, dh, el, ignore);
                if (this.IsMapElement) {
                    setTimeout(() => {
                        this.FixMap(this.CurrelFixMap, this.currelRectificationIsKeepRatio, this.CurrelFixMapLevel);
                    }, 0);
                }
                ;
            }
        };
        let enhanceFn = debounce(this.resizeListener, 30);
        resize && window.addEventListener('resize', () => { enhanceFn(""); });
        this.isScreenScaleRunning = true;
    }
    /**
     * @des 解决事件偏移
     */
    FixMap(el = ["#app"], isKeepRatio = false, level = 1) {
        if (!this.isScreenScaleRunning) {
            console.error("尚未初始化");
        }
        if (!el) {
            console.error(`ScreenScale: 选择器错误: ${el}`);
        }
        this.currelRectificationIsKeepRatio = isKeepRatio;
        this.CurrelFixMap = el;
        this.CurrelFixMapLevel = level;
        for (let i in this.CurrelFixMap) {
            let rectification = this.currScale == 1 ? 1 : this.currScale * level;
            let item = document.querySelector(this.CurrelFixMap[i]);
            if (!item) {
                console.error("FixMap: 未找到任何元素");
                return;
            }
            if (!this.IsMapElement) {
                item.originalWidth = item.clientWidth;
                item.originalHeight = item.clientHeight;
            }
            if (isKeepRatio) {
                item.style.width = `${item.originalWidth * rectification}px`;
                item.style.height = `${item.originalHeight * rectification}px`;
            }
            else {
                item.style.width = `${100 * rectification}%`;
                item.style.height = `${100 * rectification}%`;
            }
            item.style.transform = `scale(${1 / this.currScale})`;
            item.style.transformOrigin = `0 0`;
        }
        this.IsMapElement = true;
    }
    /**
     * @des 调整大小 | 自适应最小的 边长
     */
    KeepFit(dw, dh, domStr, ignore) {
        let dom = document.querySelector(domStr);
        const clientHeight = document.documentElement.clientHeight;
        const clientWidth = document.documentElement.clientWidth;
        this.currScale = (clientWidth / clientHeight) < (dw / dh) ? clientWidth / dw : clientHeight / dh;
        if (this.options.isKeepRadio) {
            dom.style.overflow = "hidden";
            dom.style.width = `${this.options.dw}px`;
            dom.style.height = `${this.options.dh}px`;
            dom.style.position = `absolute`;
            dom.style.transform = `scale(${this.currScale}) translate(-50%, -50%)`;
            dom.style.left = "50%";
            dom.style.top = "50%";
        }
        else {
            dom.style.height = `${clientHeight / this.currScale}px`;
            dom.style.width = `${clientWidth / this.currScale}px`;
            dom.style.transform = `scale(${this.currScale})`;
        }
        const ignoreStyleDOM = document.querySelector('#ignoreStyle');
        ignoreStyleDOM.innerHTML = '';
        for (let item of ignore) {
            let itemEl = item.el || item.dom;
            typeof item == "string" && (itemEl = item);
            if (!itemEl) {
                console.error(`autofit: bad selector: ${itemEl}`);
                continue;
            }
            let realScale = item.scale ? item.scale : 1 / this.currScale;
            let realFontSize = realScale != this.currScale ? item.fontSize : "autofit";
            let realWidth = realScale != this.currScale ? item.width : "autofit";
            let realHeight = realScale != this.currScale ? item.height : "autofit";
            let regex = new RegExp(`${itemEl}(\x20|{)`, "gm");
            let isIgnored = regex.test(ignoreStyleDOM.innerHTML);
            if (isIgnored) {
                continue;
            }
            ignoreStyleDOM.innerHTML += `\n${itemEl} { 
        transform: scale(${realScale})!important;
        transform-origin: 0 0;
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
export { ScreenScale };
export default ScreenScale;
