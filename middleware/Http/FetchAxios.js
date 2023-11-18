// 暂时不做响应器 的 统一封装，因为这玩意是可以基于流式的
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
class FetchAxios {
    BaseConfig = {};
    interceptors = { request: {}, response: {} };
    constructor() {
        this.BaseConfig = {
            "Mode": "common",
            "TimeOut": 10000,
            "Retry": 3,
            "MaxConcurrent": 1,
            "NowConcurrentNumber": 0
        };
        this.BaseConfig.BeforeRequest = (config) => {
            return config;
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
     * @param param0
     * @returns
     */
    common({ method, mode, cache, headers, data, signal, url }) {
        let init;
        let BaseRequestBefore = this.BaseConfig.BeforeRequest({
            method, mode, cache, headers, data, signal, url
        });
        init = {
            url: BaseRequestBefore.url,
            method: BaseRequestBefore.method,
            mode: BaseRequestBefore.mode,
            cache: BaseRequestBefore.cache,
            headers: BaseRequestBefore.headers,
            body: BaseRequestBefore.data,
            signal: BaseRequestBefore.signal
        };
        // 2.2 get post 不同请求
        if (init.method == "GET") {
            if (init.data && Object.prototype.toString.call(init.data) !== "[object Object]") {
                console.error("传参需要json,链路中断");
                return;
            }
            init.url = init.url + "?" + QsString(init.data);
            Reflect.deleteProperty(init, "body");
        }
        else if (init.method == "POST") {
            if (Object.prototype.toString.call(init.data) == '[object FormData]') {
            }
            else {
                // post中区分文件 和 普通data
                init.body = JSON.stringify(init.data);
            }
        }
        // 2.3 超时功能 | sse 不需要超时功能
        if (this.BaseConfig.TimeOut && !init.signal) {
            init.signal = AbortSignal.timeout(this.BaseConfig.TimeOut);
        }
        // 2.6 全局基础配置
        init.url = this.BaseConfig.BaseUrl + init.url;
        return init;
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
    request({ method, mode, cache, headers, data, signal, url }, { onclose, onmessage, onopen, onerror } = {}) {
        let that = this;
        // 3.1 一般模式
        let init = this.common({ method, mode, cache, headers, data, signal, url });
        // 3.2 hook 初始化 
        let res;
        let retryTimer = null;
        let curRequestController;
        return new Promise((resolve, reject) => {
            // 3.2 主文件
            async function main(retry) {
                if (retry <= 0) {
                    throw new Error("到达最大重试次数");
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
                            retry--;
                            that.BaseConfig.NowConcurrentNumber--;
                            main(retry);
                            reject();
                        }
                        that.BaseConfig.NowConcurrentNumber--;
                        await that.pauseIfNeeded();
                        resolve(result);
                    }
                    catch {
                        that.BaseConfig.NowConcurrentNumber--;
                        main(retry--);
                    }
                }
                // 3.2.2
            }
            main(that.BaseConfig.Retry);
            // resolve("")
        });
    }
}
let CaseFetchAxios = new FetchAxios();
export { CaseFetchAxios };
