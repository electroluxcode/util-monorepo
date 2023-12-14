let currRenderDom = null;
let currelRectification = "";
let currelRectificationLevel = "";
let resizeListener = null;
let timer = null;
let currScale = 1;
let isElRectification = false;
const autofit = {
  isAutofitRunnig: false,
  init(options = {}, isShowInitTip = true) {
    if (isShowInitTip) {
      console.log(`autofit.js is running`);
    }
    const {
      dw = 1920,
      dh = 1080,
      el = typeof options === "string" ? options : "body",
      resize = true,
      ignore = [],
      transition = "none",
      delay = 0,
      limit = 0.1,
    } = options;
    currRenderDom = el;
    let dom = document.querySelector(el);
    if (!dom) {
      console.error(`autofit: '${el}' is not exist`);
      return;
    }
    const style = document.createElement("style");
    const ignoreStyle = document.createElement("style");
    style.lang = "text/css";
    ignoreStyle.lang = "text/css";
    style.id = "autofit-style";
    ignoreStyle.id = "ignoreStyle";
    style.innerHTML = `body {overflow: hidden;}`;
    const bodyEl = document.querySelector("body");
    bodyEl.appendChild(style);
    bodyEl.appendChild(ignoreStyle);
    dom.style.height = `${dh}px`;
    dom.style.width = `${dw}px`;
    dom.style.transformOrigin = `0 0`;
    dom.style.overflow = "hidden";
    keepFit(dw, dh, dom, ignore, limit);
    resizeListener = () => {
      clearTimeout(timer);
      if (delay != 0)
        timer = setTimeout(() => {
          keepFit(dw, dh, dom, ignore, limit);
          isElRectification &&
            elRectification(currelRectification, currelRectificationLevel);
        }, delay);
      else {
        keepFit(dw, dh, dom, ignore, limit);
        isElRectification &&
          elRectification(currelRectification, currelRectificationLevel);
      }
    };
    resize && window.addEventListener("resize", resizeListener);
    this.isAutofitRunnig = true;
    setTimeout(() => {
      dom.style.transition = `${transition}s`;
    });
  },
  off(el = "body") {
    try {
      isElRectification = false;
      window.removeEventListener("resize", resizeListener);
      document.querySelector("#autofit-style").remove();
      const ignoreStyleDOM = document.querySelector("#ignoreStyle");
      ignoreStyleDOM && ignoreStyleDOM.remove();
      document.querySelector(currRenderDom ? currRenderDom : el).style = "";
      isElRectification && offelRectification();
    } catch (error) {
      console.error(`autofit: Failed to remove normally`, error);
      this.isAutofitRunnig = false;
    }
    this.isAutofitRunnig && console.log(`autofit.js is off`);
  },
};
function elRectification(el, level = 1) {
  if (!autofit.isAutofitRunnig) {
    console.error("autofit.js：autofit has not been initialized yet");
  }
  !el && console.error(`autofit.js：bad selector: ${el}`);
  currelRectification = el;
  currelRectificationLevel = level;
  const currEl = document.querySelectorAll(el);
  if (currEl.length == 0) {
    console.error("autofit.js：elRectification found no element");
    return;
  }
  for (let item of currEl) {
    if (!isElRectification) {
      item.originalWidth = item.clientWidth;
      item.originalHeight = item.clientHeight;
    }
    let rectification = currScale == 1 ? 1 : currScale * level;
    item.style.width = `${item.originalWidth * rectification}px`;
    item.style.height = `${item.originalHeight * rectification}px`;
    item.style.transform = `scale(${1 / currScale})`;
    item.style.transformOrigin = `0 0`;
  }
  isElRectification = true;
}
function offelRectification() {
  if (!currelRectification) return;
  for (let item of document.querySelectorAll(currelRectification)) {
    item.style.width = ``;
    item.style.height = ``;
    item.style.transform = ``;
  }
}
function keepFit(dw, dh, dom, ignore, limit) {
  let clientHeight = document.documentElement.clientHeight;
  let clientWidth = document.documentElement.clientWidth;
  currScale =
    clientWidth / clientHeight < dw / dh ? clientWidth / dw : clientHeight / dh;
  currScale = Math.abs(1 - currScale) > limit ? currScale.toFixed(2) : 1;
  let height = Math.round(clientHeight / currScale);
  let width = Math.round(clientWidth / currScale);
  dom.style.height = `${height}px`;
  dom.style.width = `${width}px`;
  dom.style.transform = `scale(${currScale})`;
  const ignoreStyleDOM = document.querySelector("#ignoreStyle");
  ignoreStyleDOM.innerHTML = "";
  for (let item of ignore) {
    let itemEl = item.el || item.dom;
    typeof item == "string" && (itemEl = item);
    if (!itemEl) {
      console.error(`autofit: bad selector: ${itemEl}`);
      continue;
    }
    let realScale = item.scale ? item.scale : 1 / currScale;
    let realFontSize = realScale != currScale ? item.fontSize : "autofit";
    let realWidth = realScale != currScale ? item.width : "autofit";
    let realHeight = realScale != currScale ? item.height : "autofit";
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
export { elRectification };
export default autofit;