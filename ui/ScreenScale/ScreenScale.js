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
                    }, 1000);
                }
                ;
            }
            // this.updateElementSize()
        };
        // this.resizeListener
        let enhanceFn = debounce(this.resizeListener, 500);
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
            let item = document.querySelector(this.CurrelFixMap[i]);
            // let item = this.CurrelFixMap[i] as any
            if (!item) {
                console.error("FixMap: 未找到任何元素");
                // return;
            }
            if (!this.IsMapElement) {
                item.originalWidth = item.clientWidth;
                item.originalHeight = item.clientHeight;
                item.originBounding = item.getBoundingClientRect();
                console.log("初次渲染fixmap:", {
                    originalWidth: item.clientWidth,
                    originalHeight: item.clientHeight,
                    originBounding: item.getBoundingClientRect()
                });
            }
            // (item as any).originalWidth = item.clientWidth;
            // (item as any).originalHeight = item.clientHeight;
            // (item as any).originalHeight = item.clientHeight;
            let w1 = this.CurrelScaleRadio.NowRadio.width / this.CurrelScaleRadio.initRadio.width;
            let h1 = this.CurrelScaleRadio.NowRadio.height / this.CurrelScaleRadio.initRadio.height;
            let radio1 = this.CurrelScaleRadio.NowRadio.width / this.CurrelScaleRadio.NowRadio.height;
            let radio2 = this.CurrelScaleRadio.initRadio.width / this.CurrelScaleRadio.initRadio.height;
            let radio3 = item.originalWidth / item.originalHeight;
            // 得到变化尺寸 用于自定义
            const rectification = this.currScale === 1 ? 1 : this.currScale * Number(level);
            // 不等比例缩放
            // 下面是等比例缩放的情况
            // let radio = this.CurrelScaleRadio.initRadio / this.CurrelScaleRadio.NowRadio;
            // 变化的时候 会优先满足 最短的一条边长(高) * rectification * rectification
            item.style.transform = `scale(${1 / this.currScale}) `;
            // console.log({
            //       "现在的高度比例": this.testVar.heightRadio ,
            //       "现在的宽度比例": this.testVar.widthRadio
            //       // faceHeight: `${(item as any).originalHeight * this.currScale }px `,
            //       // factWidth: `${(item as any).originalWidth* this.currScale   }px `
            //     },{radio1,radio2,w1,h1,currScale:this.currScale,CurrelScaleRadio:this.CurrelScaleRadio});
            // /w1 * h1
            // if() * this.currScale
            item.style.transformOrigin = `0 0`;
            // let countWidth =(item as any).originalWidth / this.options.dw
            // (item as any).style.height = `${(item as any).originalHeight * this.currScale}px `;
            // (item as any).style.width = `${(item as any).originalWidth * this.currScale }px `;
            // this.dom.style.setProperty('--scale', 1/this.currScale);
            // document.documentElement.style.setProperty('--scale', String(this.currScale));
            //     let clientWidth =(item as any).originalWidth * this.currScale
            //     let clientHeight = (item as any).originalHeight * this.currScale
            // let currScale = clientWidth / clientHeight < radio1 ?  clientHeight / this.CurrelScaleRadio.NowRadio.height
            // (item as any).style.height = `${(item as any).originalHeight }px `;
            // (item as any).style.width = `${(item as any).originalWidth  }px `;
            // +100*this.testVar.heightRad   /w1 * h1
            // (item as any).style.height = `${(item as any).originalHeight*(this.testVar.heightRadio  ?? 1) }px `;
            // (item as any).style.width = `${((item as any).originalWidth)*(this.testVar.widthRadio ?? 1)  }px `;
            // this.CurrelScaleRadio.initRadio.width
            let radioHeight = item.originalHeight / this.options.dh;
            // let radioWidth = ((item as any).originalWidth)/this.options.dw!;
            // let radioHeight = 1;
            let radioWidth = (item.originalWidth) / this.options.dw;
            //得到比例
            console.log("zptest:", {
                // "初始容器高度比":(item as any).originalHeight/this.options.dh,
                // "初始容器宽度比":(item as any).originalWidth/this.options.dw,
                "目前大容器高度": document.documentElement.clientHeight,
                "目前大容器宽度": document.documentElement.clientWidth,
                "目前大容器": this.dom,
                "radioHeight": [item.originalHeight, this.options.dh, radioHeight],
                "实际高": `${radioHeight * this.dom.offsetHeight * (this.currScale)}`,
                "radio1": radio1,
                "this.currScale": this.currScale,
                radio3: radio3
            });
            // (item as any).style.height = `${(item as any).originalHeight/this.options.dh! *document.documentElement.clientHeight}px `;
            if (radio2 > radio3) {
            }
            // let realHeight = 
            let containerHeight = document.querySelector(this.options.el).getBoundingClientRect().height;
            let containerTop = item.getBoundingClientRect().top;
            let containerBottom = (item.getBoundingClientRect().bottom - item.getBoundingClientRect().height);
            document.querySelector(this.options.el).addEventListener("transitionend", () => {
                item = document.querySelector(this.CurrelFixMap[i]);
                let containerHeight = document.querySelector(this.options.el).getBoundingClientRect().height;
                let containerTop = item.getBoundingClientRect().top;
                let containerBottom = (item.getBoundingClientRect().bottom - item.getBoundingClientRect().height);
                item.style.height = `${containerHeight - containerTop - containerBottom}px   `;
                // (item as any).style.height = `${this.currScale *(item as any).originalHeight}px  `;
                let containerWidth = document.querySelector(this.options.el).getBoundingClientRect().width;
                let containerLeft = item.getBoundingClientRect().left;
                let containerRight = (document.querySelector(this.options.el).getBoundingClientRect().width - item.getBoundingClientRect().right);
                console.log("触发");
                item.style.width = `${containerWidth - containerRight - containerLeft}px   `;
            });
            item.style.height = `${containerHeight - containerTop - containerBottom}px   `;
            // (item as any).style.height = `${this.currScale *(item as any).originalHeight}px  `;
            item.style.width = `${this.currScale * item.originalWidth}px  `;
            // debugger
            // (item as any).style.height = `${radioHeight *this.dom.offsetHeight*(this.currScale)}px  `;
            // (item as any).style.width = `${radioWidth*document.documentElement.clientWidth  }px`;
            // (item as any).style.height = `${radioHeight *this.dom.offsetHeight*(this.currScale)}px  `;
            // (item as any).style.width =  `${radioWidth *this.dom.offsetWidth*(this.currScale)}px  `;
            // (item as any).style.height = `${(item as any).originalHeight/h1 * w1  }px `;
            // (item as any).style.width = `${((item as any).originalWidth)/w1 * h1 }px `;
        }
        this.IsMapElement = true;
    }
    /**
     * @des 调整大小 | 自适应最小的 边长
     */
    KeepFit(dw, dh, domStr, ignore) {
        // dom.style.transform = ``;
        let dom = document.querySelector(domStr);
        const clientHeight = document.documentElement.clientHeight;
        const clientWidth = document.documentElement.clientWidth;
        // document.body.getBoundingClientRect()
        // const clientHeight = document.body.getBoundingClientRect().height;
        // const clientWidth = document.body.getBoundingClientRect().width;
        this.currScale = clientWidth / clientHeight < dw / dh ? clientWidth / dw : clientHeight / dh;
        this.testVar = {
            widthRadio: clientWidth / dw,
            heightRadio: clientHeight / dh,
        };
        if (clientWidth / clientHeight < dw) {
            // dom.style.height = `${clientHeight / this.currScale}px`;
        }
        else {
            // dom.style.width = `${clientWidth / this.currScale}px`;
        }
        // dom.style.height =`${clientHeight /  ( clientWidth / dw) }px` ;
        // dom.style.width =  `${clientWidth / (clientHeight / dw)}px`;
        dom.style.height = `${clientHeight / this.currScale}px`;
        dom.style.width = `${clientWidth / this.currScale}px`;
        dom.style.transform = `scale(${this.currScale})`;
        const ignoreStyleDOM = document.querySelector('#ignoreStyle');
        ignoreStyleDOM.innerHTML = '';
    }
}
// window.addEventListener("resize",()=>{
//   window.location.reload()
// })
export { ScreenScale };
export default ScreenScale;
