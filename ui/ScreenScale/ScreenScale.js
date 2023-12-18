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
    CurrelFixMapLevel = '';
    resizeListener = null;
    timer = null;
    currScale = 1;
    isScreenScaleRunning = false;
    IsMapElement = false;
    // 等比例缩放
    CurrelScaleRadio = {
        NowRadio: { width: 0, height: 0 }, initRadio: { width: 0, height: 0 }
    };
    dom;
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
        this.options = options;
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
        dom.style.transformOrigin = `left top`;
        setTimeout(() => {
            dom.style.transition = `${transition}s`;
        }, 0);
        dom.style.overflow = "hidden";
        if (!dom) {
            console.error(`ScreenScale: '${el}' 不存在`);
            return;
        }
        this.KeepFit(dw, dh, el, ignore);
        this.dom = dom;
        this.resizeListener = () => {
            // window.location.reload()
            if (this.timer)
                clearTimeout(this.timer);
            this.CurrelScaleRadio.NowRadio = {
                width: document.documentElement.clientWidth,
                height: document.documentElement.clientHeight
            };
            if (delay !== 0) {
                this.KeepFit(dw, dh, el, ignore);
                if (this.IsMapElement)
                    this.FixMap(this.CurrelFixMap, this.CurrelFixMapLevel);
            }
            else {
                this.KeepFit(dw, dh, el, ignore);
                if (this.IsMapElement) {
                    setTimeout(() => {
                        this.FixMap(this.CurrelFixMap, this.CurrelFixMapLevel);
                    }, 0);
                }
                ;
            }
            // this.updateElementSize()
        };
        // this.resizeListener
        let enhanceFn = debounce(this.resizeListener, 30);
        resize && window.addEventListener('resize', () => { enhanceFn(""); });
        // resize && window.addEventListener('resize',this.resizeListener);
        // enhanceFn("")
        this.isScreenScaleRunning = true;
        this.CurrelScaleRadio.initRadio = {
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight
        };
    }
    updateElementSize() {
        let dom = this.dom;
        dom.style.height = `${document.documentElement.clientHeight / this.currScale}px`;
        dom.style.width = `${document.documentElement.clientWidth / this.currScale}px`;
    }
    /**
     * 调整指定元素以进行缩放。一次缩放一个
     * @param el - 要调整的元素选择器。不能传入元素
     * @param level - 缩放级别（默认为 1）。
     */
    FixMap(el = ["#app"], level = "1") {
        if (!this.isScreenScaleRunning) {
            console.error("尚未初始化");
        }
        if (!el) {
            console.error(`ScreenScale: 选择器错误: ${el}`);
        }
        this.CurrelFixMap = el;
        this.CurrelFixMapLevel = level;
        for (let i in this.CurrelFixMap) {
            console.log(this.CurrelFixMap);
            let item = document.querySelector(this.CurrelFixMap[i]);
            // let item = this.CurrelFixMap[i] as any
            if (!item) {
                console.error("FixMap: 未找到任何元素");
                // return;
            }
            if (!this.IsMapElement) {
                item.originalWidth = item.clientWidth;
                item.originalHeight = item.clientHeight;
            }
            // 变化的时候 会优先满足 最短的一条边长(高) * rectification * rectification
            item.style.transform = `scale(${1 / this.currScale}) `;
            item.style.transformOrigin = `0 0`;
            document.querySelector(this.options.el).addEventListener("transitionend", () => {
                // item = document.querySelector(this.CurrelFixMap[i])!
                // let containerHeight = document.querySelector(this.options.el!)!.getBoundingClientRect().height;
                // let containerTop = item!.getBoundingClientRect().top;
                // let containerBottom =( containerHeight-item!.getBoundingClientRect().height-item!.getBoundingClientRect().top) ;
                // (item as any).style.height = `${containerHeight -containerTop-containerBottom }px   `;
                // let containerWidth = document.querySelector(this.options.el!)!.getBoundingClientRect().width;
                // let containerLeft = item!.getBoundingClientRect().left;
                // // let containerRight =( item!.getBoundingClientRect().right-item!.getBoundingClientRect().width) ;
                // let containerRight =( containerWidth-item!.getBoundingClientRect().left-item!.getBoundingClientRect().width) ;
                // (item as any).style.width = `${containerWidth-containerRight-containerLeft }px   `;
                // debugger
            });
            item.style.height = `${this.currScale * 100}%`;
            item.style.width = `${this.currScale * 100}%`;
            // (item as any).style.height = `${item.clientHeight}px`;
            // (item as any).style.width = `${item.clientWidth}px`;
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
        // if((clientWidth / clientHeight)< (dw / dh)){
        //   let curr = clientWidth / dw
        //   dom.style.height = `${clientHeight / this.currScale}px`;
        //   dom.style.width = `${clientWidth / this.currScale}px`;  
        // }else{
        //   let curr = clientWidth / dw
        // dom.style.height = `${clientHeight / this.currScale}px`;
        // dom.style.width = `${clientWidth / this.currScale}px`;
        // }
        dom.style.height = `${clientHeight / this.currScale}px`;
        dom.style.width = `${clientWidth / this.currScale}px`;
        dom.style.transform = `scale(${this.currScale})`;
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
