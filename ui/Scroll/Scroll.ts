/**
 * @des 竖向自动滚动
 * @param dom 
 * @param distance 每一次运作的距离 
 * @param interval 每一次的间隔
 * @returns 
 */
function Scroll(dom:HTMLDivElement,distance=1,interval=100) {
    // step1:检查有没有height
    if(dom.style.height || dom.style.maxHeight || dom.style.minHeight ||  dom.style.overflow){
        throw new Error("注意没有height属性或者overflow属性。中断scroll")
    }
    console.log(dom.style)
    let nowHeight = 0;
    let height = dom.scrollHeight;
    let id = setInterval(() => {
        if (height > nowHeight) {
            nowHeight = nowHeight + distance;
            dom.scroll(0, nowHeight);
        } else {
            nowHeight = 0
            dom.scroll(0, nowHeight);
        }
    }, interval);
    return function destoy(){
        clearInterval(id)
    }
}

export {Scroll}