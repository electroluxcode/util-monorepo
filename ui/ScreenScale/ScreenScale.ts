interface Base {
  dw?: number;
  dh?: number;
  el?: string;
  resize?: boolean;
  ignore?: string[];
  transition?: string;
  delay?: number;
}

let debounce = (fn: Function, timer: number) => {
  let flag: any;
  return function (args: any) {
    if (flag) {
      clearTimeout(flag);
    }
    flag = setTimeout(() => {
      fn(args);
    }, timer);
  }

}
class ScreenScale {
  private CurrelFixMap: string[] = ["#app"];
  private CurrelFixMapLevel: string = '';
  private resizeListener: (() => void) | null = null;
  private timer: any = null;
  private currScale: number = 1;
  private isScreenScaleRunning: boolean = false;
  private IsMapElement: boolean = false;
  // 等比例缩放
  private CurrelScaleRadio : {
    NowRadio:{ width:any, height:any }; initRadio:{ width:any, height:any } } = {
    NowRadio:{ width:0, height:0 }, initRadio:{ width:0, height:0 }
  }
  options: Base;
  /**
   * 初始化 ScreenScale 类。
   * @param options - ScreenScale 的配置选项。
   * @param isShowInitTip - 是否显示初始化消息（默认为 true）。
   */
  public init(options: Base = {}, isShowInitTip: boolean = true): void {
    // step1:输出label
    if (isShowInitTip) {
      console.log(`util_monorepo/scale:` + ` 运行中`);
    }
    
    this.options = options
    const { dw = 1920, dh = 929, el, resize = true, ignore = [], transition = 'none', delay = 0 } = options;
    if(!el){
      console.error(`ScreenScale: '${el}' 没有输入`);
      return;
    }
    const dom = document.querySelector(el)! as HTMLElement;

    
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
    bodyEl!.appendChild(style);
    bodyEl!.appendChild(ignoreStyle);


    dom.style.height = `${dh}px`;
    dom.style.width = `${dw}px`;


    dom.style.transformOrigin = `left top`;
    setTimeout(() => {
      dom.style.transition = `${transition}s`;
    }, 0);
    dom.style.overflow = "hidden";

    this.KeepFit(dw, dh, dom, ignore);

    this.resizeListener = () => {
      // window.location.reload()
      if (this.timer) clearTimeout(this.timer);
      this.CurrelScaleRadio.NowRadio = {
        width:document.body.clientWidth ,
        height: document.body.clientHeight
      }
      if (delay !== 0) {

        this.KeepFit(dw, dh, dom, ignore);
        if (this.IsMapElement) this.FixMap(this.CurrelFixMap, this.CurrelFixMapLevel);

      } else {

        this.KeepFit(dw, dh, dom, ignore);
        if (this.IsMapElement) this.FixMap(this.CurrelFixMap, this.CurrelFixMapLevel);
      }
    };
    // this.resizeListener
    let enhanceFn = debounce(this.resizeListener, 300)
    resize && window.addEventListener('resize', () => { enhanceFn("") });
    // resize && window.addEventListener('resize',this.resizeListener);
    enhanceFn("")
    this.isScreenScaleRunning = true;
    this.CurrelScaleRadio.initRadio = {
      width:document.body.clientWidth ,
      height: document.body.clientHeight
    }
  }



  /**
   * 调整指定元素以进行缩放。一次缩放一个
   * @param el - 要调整的元素选择器。不能传入元素
   * @param level - 缩放级别（默认为 1）。
   */
  public FixMap(el: string[] = ["#app"], level: string = "1",): void {
    
    if (!this.isScreenScaleRunning) {
      console.error("尚未初始化");
    }
    if (!el) {
      console.error(`ScreenScale: 选择器错误: ${el}`);
    }

    this.CurrelFixMap = el;
    this.CurrelFixMapLevel = level;

    for (let i in this.CurrelFixMap) {
      // let item = document.querySelector(this.CurrelFixMap[i])!
      let item = this.CurrelFixMap[i] as any
      if (!item) {
        console.error("FixMap: 未找到任何元素");
        return;
      }
      
      if (!this.IsMapElement) {
        (item as any).originalWidth = item.clientWidth;
        (item as any).originalHeight = item.clientHeight;
        // console.log("初次渲染:",{
        //   originalWidth:item.clientWidth,
        //   originalHeight:item.originalHeight,
        // })
      }
      let w1 =  this.CurrelScaleRadio.NowRadio.width / this.CurrelScaleRadio.initRadio.width
      let h1 =  this.CurrelScaleRadio.NowRadio.height/ this.CurrelScaleRadio.initRadio.height
      let radio1 = this.CurrelScaleRadio.NowRadio.width / this.CurrelScaleRadio.NowRadio.height
      let radio2 = this.CurrelScaleRadio.initRadio.width / this.CurrelScaleRadio.initRadio.height
      // 得到变化尺寸 用于自定义
      const rectification = this.currScale === 1 ? 1 : this.currScale * Number(level);

      // 不等比例缩放

      // 下面是等比例缩放的情况
      // let radio = this.CurrelScaleRadio.initRadio / this.CurrelScaleRadio.NowRadio;
      
      
      
      // 变化的时候 会优先满足 最短的一条边长(高) * rectification * rectification
      (item as any).style.transform = `scale(${1 / this.currScale}) `;
      (item as any).style.transformOrigin = `0 0`;
      // console.log({
      //   item:item,
      //       faceHeight: `${(item as any).originalHeight * this.currScale }px `,
      //       factWidth: `${(item as any).originalWidth* this.currScale   }px `
      //     },{radio1,radio2,w1,h1,currScale:this.currScale,CurrelScaleRadio:this.CurrelScaleRadio});

         
      if(Math.abs(1-h1)<0.1){
          // (item as any).style.height = `${(item as any).originalHeight     }px`;
          // (item as any).style.width = `${(item as any).originalWidth   * this.currScale   }px`;
      }else if (Math.abs(1-w1)<0.1){
        // console.log("其他ddd");
        // (item as any).style.height = `${(item as any).originalHeight * this.currScale      }px`;
        //   (item as any).style.width = `${(item as any).originalWidth    }px`;
        // (item as any).style.height = `${(item as any).originalHeight  * this.currScale    }px`;
          // (item as any).style.width = `${(item as any).originalWidth   * this.currScale / h1   }px`;
        //   console.log({
        //     factWidth: `${(item as any).originalWidth   * this.currScale / h1   }px`,
        //     faceHeight: `${(item as any).originalHeight  * this.currScale /w1   }px`
        //   },{radio1,radio2,w1,h1,currScale:this.currScale,CurrelScaleRadio:this.CurrelScaleRadio})
      }
     
      
      if(Math.abs(radio1-radio2)<0.005){
        
        // console.log("等比例:")
      }else{
      //   console.log(`${Number(item.style.height.replace("px",""))  * this.currScale    }`);
      //   (item as any).style.height = `${Number(item.style.height.replace("px",""))  * this.currScale    }`;
      // (item as any).style.width = `${Number(item.style.width.replace("px",""))   * this.currScale    }`;
      }

      // /w1 * h1
      // if()
      (item as any).style.height = `${(item as any).originalHeight * this.currScale }px `;
      (item as any).style.width = `${(item as any).originalWidth* this.currScale  }px `;
    }


    this.IsMapElement = true;
  }

  /**
   * @des 调整大小
   * @param dw 
   * @param dh 
   * @param dom 
   * @param ignore 
   */
  private KeepFit(dw: number, dh: number, dom: HTMLElement, ignore: any): void {
    const clientHeight = document.documentElement.clientHeight;
    const clientWidth = document.documentElement.clientWidth;
    this.currScale = clientWidth / clientHeight < dw / dh ? clientWidth / dw : clientHeight / dh;
    dom.style.height = `${clientHeight / this.currScale}px`;
    dom.style.width = `${clientWidth / this.currScale}px`;
    dom.style.transform = `scale(${this.currScale}`;
    const ignoreStyleDOM = document.querySelector('#ignoreStyle') as HTMLStyleElement;
    ignoreStyleDOM.innerHTML = '';

    for (let item of ignore) {
      let itemEl = item.el || item.dom;
      if (typeof item === 'string') itemEl = item;
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
window.addEventListener("resize",()=>{
  window.location.reload()
})
export {
  ScreenScale
};
export default ScreenScale;


