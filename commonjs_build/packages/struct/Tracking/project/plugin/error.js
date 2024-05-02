"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorPlugin = void 0;
///<reference path = "base.d.ts" />
class errorPlugin {
    trackConfigData;
    constructor(obj) {
        this.trackConfigData = obj;
    }
    autoRun() {
        console.log("error-autoRun");
        this.util();
    }
    util() {
        let arr = [];
        window.addEventListener("error", (e) => {
            console.log("---error---:", e);
            if (e instanceof ErrorEvent) {
                arr.push({
                    type: "ErrorEvent",
                    url: window.location.href,
                    extraInfo: {
                        lineno: e.lineno,
                        message: e.message,
                        timeStamp: e.timeStamp,
                    },
                });
            }
            else if (e instanceof Event) {
                // Event 需要特殊处理，这里是加载资源报错
                let target = e.target;
                let tagName = target.tagName;
                if (tagName.toUpperCase() === "IMG" ||
                    tagName.toUpperCase() === "VIDEO" ||
                    tagName.toUpperCase() === "SCRIPT") {
                    // 可以通过 target.dataset 设置重试次数
                    arr.push({
                        type: "ErrorResource",
                        url: window.location.href,
                        extraInfo: {
                            name: e.target?.src,
                            element: tagName,
                            timeStamp: e.timeStamp,
                        },
                    });
                    // target.src = "./error.svg";
                }
            }
        }, true);
        window.addEventListener("unhandledrejection", (e) => {
            throw e.reason;
        });
        document.addEventListener("visibilitychange", (e) => {
            let SendData = JSON.parse(JSON.stringify(arr));
            if (document.visibilityState === "hidden") {
                this.trackConfigData.trackSend({
                    data: SendData,
                });
                arr = [];
            }
        });
    }
}
exports.errorPlugin = errorPlugin;
