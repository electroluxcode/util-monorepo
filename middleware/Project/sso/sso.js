document.querySelector("button")?.addEventListener("click", () => {
    console.log("点击了我");
    window.postMessage("sso验证成功", "*");
});
// 前端心跳检测是不是某一个界面打开
if (!window.opener) {
    alert("请从指定页面打开:");
    window.close();
}
window.opener.addEventListener("message", function (event) {
    console.log("window.opener:请求示例回调:event", event);
    // 判断来源
    if (event.origin != "http://127.0.0.1:5501") {
        return;
    }
});
