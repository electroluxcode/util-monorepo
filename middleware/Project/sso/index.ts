document.querySelector("button")?.addEventListener("click",()=>{
    console.log("点击了我")
    let bs = window.open("./sso.html")!;

    window.addEventListener("close",()=>{
        bs.postMessage("父窗口关掉了","")
    })
    bs.addEventListener("message", function (event) {
        console.log("sso:请求示例回调:event",event)
        // 判断来源
        if(event.origin !="http://127.0.0.1:5501"){
            return
        }
    });
    bs.addEventListener("close", function (event) {
        console.log("sso界面被关闭",event,bs)
    });
})


console.log("test")