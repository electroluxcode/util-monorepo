type MessageType = {
    data:{
        target:"SSO-ZPTEST",
        type:"close" | "message" 
        data:any
    },
    [key : string] :any
}
let bs
document.querySelector("button")?.addEventListener("click",()=>{
    
    bs = window.open("./sso.html")!;
    window.addEventListener("pagehide",()=>{
        bs.postMessage({
            target:"SSO-ZPTEST",
            data:{
                id:"eee",
                type:"close"
            }
        },"")
    })
   
    // bs.addEventListener("close", function (event) {
    //     console.log("sso界面被关闭",event,bs)
    // });
})
window.addEventListener("pagehide", function () {
    bs.close()
});
window.addEventListener("message", function (event:MessageType|MessageType) {
    // 判断来源
    if(event.origin !="http://127.0.0.1:5501"){
        return
    }
    if(typeof event.data!=="object"){
        return
    }
    if(event.data.target!="SSO-ZPTEST"){
        return
    }
    console.log("父窗口|子认证中心收到的信息",event)
});

