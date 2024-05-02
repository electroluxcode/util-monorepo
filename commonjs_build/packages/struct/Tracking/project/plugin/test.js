/**
 * @des 插件定义示例
 * @param object.trackSend string 插件发送的地址
 * @param object.trackConfig object object 插件的配置
 */
class pluginTest {
    constructor(obj) {
        console.log("实际的object:", obj);
        // window.addEventListener("popstate", function (event) {
        // 	console.log("popstate 已经发生变化:", event);
        // });
        // window.addEventListener("hashchange", function (event) {
        // 	console.log("hashchange 已经发生变化:", event);
        // 	obj.trackSend({ url: "/api/get", data: window.location.search });
        // });
        window.addEventListener("unload", function (event) {
            console.log("hashchange 已经发生变化:", event);
            // window.location.search 包括了#号和之后的?，假如是? 之后，我们会拿到第一个?
            // window.location.hash 包括了#号和之后的，假如是#xxx#n 之后，我们会拿到第一个之后
            // new URLSearchParams(window.location.search) 返回值可以get 什么的
            obj.trackSend({
                url: "/api/get",
                data: JSON.stringify(QsObj("?", window.location.search)),
            });
        });
    }
    // 全部
    te() {
        console.log("te");
    }
}
