"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tracking = void 0;
const util_js_1 = require("./plugin/util.js");
function QsString(ob) {
    let res = "?";
    for (let i in ob) {
        res += `${i}=${ob[i]}&`;
    }
    res = res.substring(0, res.length - 1);
    return res;
}
// let obj = {
// 	user: "id1111",
// 	env: "测试",
// };
// console.log(QsString(obj));
function QsObj(split, ob) {
    let text = ob.split(split).at(-1)?.split("&");
    let res = {};
    for (let i in text) {
        let temp = text[i].split("=");
        res[temp[0]] = temp[1];
    }
    console.log("", res);
    return res;
}
/**
 * @f1 autoRun 自动注册
 * @f2 plugin 的 constructor 自动得到 trackConfig 和 trackSend({data,url})
 */
class Tracking {
    TrackingConfig;
    enhanceFn = {};
    constructor(TrackingConfig) {
        this.TrackingConfig = TrackingConfig;
        this.autoRun();
    }
    /**
     * @des 自动运行
     */
    autoRun() {
        if (this.TrackingConfig.plugins) {
            for (let i in this.TrackingConfig.plugins) {
                this.enhanceFn[i] = new this.TrackingConfig.plugins[i]({
                    trackSend: this.trackSend(),
                    trackConfig: this.TrackingConfig,
                });
                this.enhanceFn[i].autoRun();
            }
        }
    }
    pluginGet(plugin) {
        console.log("plugin:", plugin);
        return this.enhanceFn[plugin];
    }
    trackSend() {
        let baseUrl = this.TrackingConfig.reportConfig.baseUrl;
        let method = this.TrackingConfig.reportConfig.type;
        return async ({ data, url = "" }) => {
            let user = await (0, util_js_1.getUser)({ getIp: false });
            console.log("调用监控:", { data, user });
            if (method == "beacon") {
                let handleData;
                if (Object.prototype.toString.call(data) == "[object Object]" ||
                    Object.prototype.toString.call(data) == "[object Array]") {
                    handleData = JSON.stringify({ user, data: data });
                    for (let i = 0; i < 10000; i++) {
                        handleData = handleData + "8996589";
                    }
                    let is = navigator.sendBeacon(baseUrl, handleData);
                    console.log("issend:", is);
                }
            }
            // 有可能上报失败
            if (method == "image") {
                let img = new Image();
                let handleData;
                if (Object.prototype.toString.call(data) == "[object Object]" ||
                    Object.prototype.toString.call(data) == "[object Array]") {
                    handleData = "?data=" + JSON.stringify(data) + "&user=" + user;
                    img.src = baseUrl + url + handleData;
                }
            }
        };
    }
}
exports.Tracking = Tracking;
