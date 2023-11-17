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
        let that = this;
        this.interceptors.request.use = (BeforeRequest, ErrorRequest) => {
            that.BaseConfig.BeforeRequest = BeforeRequest,
                that.BaseConfig.ErrorRequest = ErrorRequest;
        };
        this.interceptors.response.use = (BeforeResponse, ErrorResponse) => {
            that.BaseConfig.BeforeResponse = BeforeResponse,
                that.BaseConfig.ErrorResponse = ErrorResponse;
        };
    }
    /**
     * @des step1:初始化
     * @param BaseConfig
     */
    create(BaseConfig) {
        this.BaseConfig.BaseUrl = BaseConfig.BaseUrl;
        this.BaseConfig.Timeout = BaseConfig.Timeout;
    }
    /**
     * @des 2.发出请求
     * @param BaseRequest
     * @returns
     */
    request(BaseRequest) {
        // 2.1初始化 初始化拦截器
        let init;
        if (this.BaseConfig.BeforeRequest) {
            let BaseRequestBefore = this.BaseConfig.BeforeRequest(BaseRequest);
            init = {
                method: BaseRequestBefore.method,
                mode: BaseRequestBefore.mode,
                cache: BaseRequestBefore.cache,
                headers: BaseRequestBefore.headers,
                body: BaseRequestBefore.data,
                signal: BaseRequestBefore.signal
            };
        }
        else {
            init = {
                method: BaseRequest.method,
                mode: BaseRequest.mode,
                cache: BaseRequest.cache,
                headers: BaseRequest.headers,
                body: BaseRequest.data,
                signal: BaseRequest.signal
            };
        }
        // init["integrity"] ="sha"+Math.random().toString(16).slice(-8)
        // 2.2 get post 不同请求
        if (BaseRequest.method == "GET") {
            if (BaseRequest.data && Object.prototype.toString.call(BaseRequest.data) !== "[object Object]") {
                console.error("传参需要json,链路中断");
                return;
            }
            BaseRequest.url = BaseRequest.url + "?" + QsString(BaseRequest.data);
            Reflect.deleteProperty(init, "body");
        }
        else if (BaseRequest.method == "POST") {
            if (Object.prototype.toString.call(BaseRequest.data) == '[object FormData]') {
            }
            else {
                // post中区分文件
                init.body = JSON.stringify(BaseRequest.data);
            }
        }
        // 2.3 
        BaseRequest.url = this.BaseConfig.BaseUrl + BaseRequest.url;
        console.log("上传", BaseRequest.url, init);
        return fetch(BaseRequest.url, init);
    }
}
let CaseFetchAxios = new FetchAxios();
export { CaseFetchAxios };
