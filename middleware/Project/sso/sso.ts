document.querySelector("button")?.addEventListener("click", () => {

    window.opener.postMessage({
        target:"SSO-ZPTEST",
        data:{
            id:"eee",
            type:"close"
        }
    }, "*");
})

// 前端心跳检测是不是某一个界面打开
if (!window.opener) {
    alert("请从指定页面打开:");
    window.close()
}
window.opener.addEventListener("close", function (event) {

    window.close()
});
window.opener.addEventListener("message", function (event) {

    if (event.origin != "http://127.0.0.1:5501") {
        return
    }
    if (typeof event.data !== "object") {
        return
    }
    if (event.data.target != "SSO-ZPTEST") {
        return
    }
    console.log("认证中心:", event)
});
