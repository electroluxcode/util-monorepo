/**
 *  @des 请求重试机制
 */
import { easyFetch } from "./easyFetch.js";
export class fetchRetry {
    /**
     * 重试 返回的格式是 axiosResponse
     */
    async retry(axiosInstance, _error, res) {
        let { request, config } = axiosInstance;
        const { waitTime = 1000, count = 0 } = config?.requestOptions?.retryRequest ?? {};
        config.__retryCount = config.__retryCount || 0;
        if (config.__retryCount >= count) {
            return Promise.reject(res);
        }
        config.__retryCount += 1;
        return this.delay(waitTime).then(() => request(config));
    }
    /**
     * 延迟
     */
    delay(waitTime) {
        return new Promise((resolve) => setTimeout(resolve, waitTime));
    }
}
const fetchRetryCase = new fetchRetry();
// method + url 拼接成一个新的 作为key
// 用 浅复制的特性将 signal进行传递
let params = {
    params: {
        id: 5,
    },
    url: "/us2ers/Electroluxcode",
    method: "get",
};
// let errorCa
let ba = new easyFetch({
    baseURL: "https://api.github.com",
    responseOptions: {
        type: "json",
    },
    requestOptions: {
    // retryRequest: {
    // 	count: 1,
    // 	isOpenRetry: true,
    // 	waitTime: 1000,
    // },
    },
    transform: {
        responseInterceptorsCatch: (axiosInstance, error) => {
            // console.log("sddsd", axiosInstance, error);
            // fetchRetryCase.retry(axiosInstance, error);
            // request({ ...config });
        },
    },
});
// ba.request(params);
