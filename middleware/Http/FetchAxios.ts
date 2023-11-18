// 暂时不做响应器 的 统一封装，因为这玩意是可以基于流式的

type BaseConfigType = {
    // 基础api
    BaseUrl?: string,
    // 最大超时时间
    TimeOut?: number,
    // 最大重试次数
    Retry?: number
    // 最大并发
    MaxConcurrent?: number
    // 目前的并发数
    NowConcurrentNumber?: number
    // 给用户两种模式。
    // hook模式是可以自己定义 BaseEventType 里面的回调(sse)
    // common 模式是跟 axios 一样，导出一个实例然后挂载url(get post)
    Mode?: "hook" | "common",

    BeforeRequest?: <t>(param: t) => t,
    ErrorRequest?: (...param: any) => any,
    BeforeResponse?: (...param: any) => any,
    ErrorResponse?: (...param: any) => any,
}


type BaseRequestType = {
    url?: string;
    method?: "GET" | "POST" | "SSE";
    data?: any;
    headers: Record<'Accept' | 'Content-Length' | 'User-Agent' | 'Content-Encoding' | 'Authorization', any>;
    mode?: "cors" | "no-cors" | "no-cors" | "same-origin",
    cache?: "no-store" | "default" | "no-cache",
    signal?: any;
    body?: any
}


interface EventSourceMessage {
    id: string;
    event: string;
    data: string;
    retry?: number;
}
type BaseEventType = {
    /**
     * 当接收到响应时调用。用于验证响应是否与预期相符（如果不符合预期，可以抛出错误）。
     * 如果未提供并且method是sse的时候，则会默认进行基本验证，确保内容类型为text/event-stream。
     */
    onopen?: (response: Response) => Promise<void>,

    /**
     * 当接收到消息时调用。注意：与默认的浏览器EventSource.onmessage不同，
     * 此回调用于处理所有事件，甚至具有自定义“event”字段的事件。
     */
    onmessage?: (ev: EventSourceMessage) => void;

    /**
     * 当响应完成时调用。如果不希望服务器关闭连接，可以在此处抛出异常并使用onerror重试。
     */
    onclose?: () => void;

    /**
     * 处理发生任何错误时调用，包括请求制作、消息处理、回调处理等。
     * 可以利用此功能控制重试策略：如果错误是致命的，请在回调函数中重新抛出错误以停止整个操作。
     * 否则，可以返回一个间隔时间（毫秒），在此时间后将自动重试请求（使用last-event-id）。
     * 如果未指定此回调函数，或者它返回undefined，则fetchEventSource将将每个错误视为可重试，并将在1秒后尝试再次请求。
     */
    onerror?: (err: any) => number | null | undefined | void,
}


/**
 * 变成 & 链接
 * @param ob 
 */
function QsString(ob: Record<any, any>) {
    let res = ""
    for (let i in ob) {
        res += `${i}=${ob[i]}&`
    }
    res = res.substring(0, res.length - 1)
    return res
}

class FetchAxios {
    BaseConfig: BaseConfigType = {}
    interceptors: any = { request: {}, response: {} }
    constructor() {
        this.BaseConfig = {
            "Mode": "common",
            "TimeOut": 10000,
            "Retry": 3,
            "MaxConcurrent": 1,
            "NowConcurrentNumber": 0
        }
        this.BaseConfig.BeforeRequest = (config) => {
            return config
        }
    }
    /**
     * @des step1:初始化
     * @param BaseConfig 
     */
    create(BaseConfig: BaseConfigType) {
        this.BaseConfig = Object.assign(this.BaseConfig, BaseConfig)
    }
    /**
     * @des step2:基本数据处理
     * @param param0 
     * @returns 
     */
    common({
        method, mode, cache, headers, data, signal, url
    }: BaseRequestType,): BaseRequestType {
        let init: BaseRequestType
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
        }

        // 2.2 get post 不同请求
        if (init.method == "GET") {
            if (init.data && Object.prototype.toString.call(init.data) !== "[object Object]") {
                console.error("传参需要json,链路中断");
                return
            }
            init.url = init.url + "?" + QsString(init.data)
            Reflect.deleteProperty(init, "body")
        } else if (init.method == "POST") {
            if (Object.prototype.toString.call(init.data) == '[object FormData]') {

            } else {
                // post中区分文件 和 普通data
                init.body = JSON.stringify(init.data)
            }
        }
        // 2.3 超时功能 | sse 不需要超时功能

        if (this.BaseConfig.TimeOut && !init.signal) {
            init.signal = AbortSignal.timeout(this.BaseConfig.TimeOut)
        }

        // 2.6 全局基础配置
        init.url = this.BaseConfig.BaseUrl + init.url
        return init
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
    request({
        method, mode, cache, headers, data, signal, url
    }: BaseRequestType, {
        onclose, onmessage, onopen, onerror
    }: BaseEventType = {}) {
        let that = this
        // 3.1 一般模式
        let init = this.common({ method, mode, cache, headers, data, signal, url })

        // 3.2 hook 初始化 
        let res
        let retryTimer = null;
        let curRequestController: AbortController;

        return new Promise((resolve, reject) => {

            // 3.2 主文件
            async function main(retry: number) {
                if (retry <= 0) {
                    throw new Error("到达最大重试次数")
                }

                // 3.2.1 普通模式
                if (that.BaseConfig.Mode == "common") {
                    try {
                        while (that.BaseConfig.NowConcurrentNumber >= that.BaseConfig.MaxConcurrent) { // 当暂停状态为 true 时，等待恢复
                            await new Promise(resolve => setTimeout(resolve, 1000));
                        }
                        that.BaseConfig.NowConcurrentNumber++
                        let result = await fetch(init.url, init)
                        // 错误重试机制
                        if (result.status > 300) {
                            retry--
                            that.BaseConfig.NowConcurrentNumber--
                            main(retry)
                            reject()
                        }
                        that.BaseConfig.NowConcurrentNumber--
                        await that.pauseIfNeeded()
                        resolve(result)
                    } catch {
                        that.BaseConfig.NowConcurrentNumber--
                        main(retry--)
                    }
                }

                // 3.2.2
            }
            main(that.BaseConfig.Retry);
            // resolve("")

        })

    }
}
let CaseFetchAxios = new FetchAxios()
export {
    CaseFetchAxios
}
