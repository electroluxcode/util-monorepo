// 响应器 如果 不处理默认是返回 JSON 格式的
///<reference path = "Http.d.ts" />
/**
 * 变成 & 链接
 * @param ob
 */
function QsString(ob) {
    let res = "";
    for (let i in ob) {
        res += `${i}=${ob[i]}&`;
    }
    res = res.substring(0, res.length - 1);
    return res;
}
class HttpClass {
    BaseConfig;
    constructor() {
        this.BaseConfig = {
            "Mode": "common",
            "TimeOut": 10000,
            "Retry": 1,
            "MaxConcurrent": 1,
            "NowConcurrentNumber": 0,
            "BeforeRequest": (config) => {
                return config;
            },
            "BeforeResponse": (config) => {
                return config;
            }
        };
    }
    /**
     * @des step1:初始化
     * @param BaseConfig
     */
    create(BaseConfig) {
        this.BaseConfig = Object.assign(this.BaseConfig, BaseConfig);
    }
    /**
     * @des step2:基本数据处理
     * 对于 get post 分别进行处理 和 对url进行拼接
     * @param
     * @returns
     */
    common({ method, mode, cache, headers, data, signal, url, ...args }) {
        let init;
        let BaseRequestBefore = this.BaseConfig.BeforeRequest({
            method, mode, cache, headers, data, signal, url
        });
        console.log("------------------", data, BaseRequestBefore);
        init = BaseRequestBefore;
        // 2.2 get post 不同请求
        if (init.method == "GET") {
            if (init.data && Object.prototype.toString.call(init.data) !== "[object Object]") {
                console.error("传参需要json,注意");
            }
            init.url = QsString(init.data) ? init.url + "?" + QsString(init.data) : init.url;
            Reflect.deleteProperty(init, "body");
        }
        else {
            console.log("zptest:init.data:", init);
            if (Object.prototype.toString.call(init.data) == '[object FormData]') {
                init.body = init.data;
            }
            else {
                // post中区分文件 和 普通data
                init.body = JSON.stringify(init.data);
            }
        }
        // 2.3 超时功能 | sse 不需要超时功能
        if (this.BaseConfig.TimeOut && !init.signal) {
            if (globalThis.AbortSignal && AbortSignal.timeout) {
                init.signal = AbortSignal.timeout(this.BaseConfig.TimeOut);
            }
        }
        // 2.6 全局基础配置
        init.url = this.BaseConfig.BaseUrl + init.url;
        return { ...init, ...args };
    }
    async pauseIfNeeded() {
        // console.log(this.BaseConfig.NowConcurrentNumber,",this.BaseConfig.MaxConcurrent",this.BaseConfig.NowConcurrentNumber>=this.BaseConfig.MaxConcurrent)
        while (this.BaseConfig.NowConcurrentNumber > this.BaseConfig.MaxConcurrent) { // 当暂停状态为 true 时，等待恢复
            //   console.log("暂停中")
            // console.log(this.BaseConfig.NowConcurrentNumber,this.BaseConfig.MaxConcurrent)
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
    /**
     * @des 3.发出请求
     * @param BaseRequest
     * @returns
     */
    request({ method, mode, cache, headers, data, signal, url, ...args }, { onclose, onmessage, onopen, onerror } = {}) {
        let that = this;
        console.log("zptest:data", data, args);
        // 3.1 一般模式。初始化基本参数
        let init = this.common({ method, mode, cache, headers, data, signal, url, ...args });
        // 3.2 hook 初始化 
        let res;
        let retryTimer = null;
        let curRequestController;
        return new Promise((resolve, reject) => {
            // 3.2 主文件
            async function main(retry) {
                if (retry <= 0) {
                    reject({ code: 404, config: init, data: "到达最大重试次数" });
                    return;
                }
                // 3.2.1 普通模式
                if (that.BaseConfig.Mode == "common") {
                    try {
                        while (that.BaseConfig.NowConcurrentNumber >= that.BaseConfig.MaxConcurrent) { // 当暂停状态为 true 时，等待恢复
                            await new Promise(resolve => setTimeout(resolve, 1000));
                        }
                        that.BaseConfig.NowConcurrentNumber++;
                        let result = await fetch(init.url, init);
                        // 错误重试机制
                        if (result.status > 300) {
                            console.log("error:", result);
                            retry--;
                            that.BaseConfig.NowConcurrentNumber--;
                            main(retry);
                        }
                        that.BaseConfig.NowConcurrentNumber--;
                        await that.pauseIfNeeded();
                        let output = await that.BaseConfig.BeforeResponse(result);
                        // console.log(JSON.stringify(output))
                        resolve({ code: 200, config: init, data: output });
                    }
                    catch (e) {
                        console.log("error:", e);
                        // console.error("未知报错,停止")
                        that.BaseConfig.NowConcurrentNumber--;
                        retry--;
                        main(retry);
                    }
                }
                // 3.2.2
            }
            main(that.BaseConfig.Retry);
            // resolve("")
        });
    }
}
let Http = new HttpClass();
export { Http };
// type test1 = MyOmit<test,"id">
export default Http;
