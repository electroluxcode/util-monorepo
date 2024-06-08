///<reference path = "type.d.ts" />
import { easyFetch, isFunction } from "./easyFetch.js";
import { fetchCanceler } from "./fetchCancel.js";
import { fetchRetry } from "./fetchRetry.js";
class VAxios {
    axiosInstance;
    options;
    constructor(options) {
        this.options = options;
        let fetchHook = new easyFetch({});
        fetchHook.create(options);
        this.axiosInstance = fetchHook;
        this.setupInterceptors();
    }
    setupInterceptors() {
        const { options: { transform }, } = this;
        if (!transform) {
            return;
        }
        let { requestInterceptors, requestInterceptorsCatch, responseInterceptors, responseInterceptorsCatch, } = transform;
        // f1：重复请求
        const fetchCancelerCase = new fetchCanceler();
        // f2: 失败重试
        const retryRequest = new fetchRetry();
        // 请求拦截器(正常)
        let cloneRequestInterceptors = requestInterceptors;
        requestInterceptors = (_axiosInstance, config) => {
            let result;
            if (isFunction(cloneRequestInterceptors)) {
                result = cloneRequestInterceptors(_axiosInstance, config) ?? config;
            }
            // f1: 重复请求
            if (config?.requestOptions?.isDeduplication) {
                fetchCancelerCase.addPending(config);
            }
            return result;
        };
        // 响应拦截器(正常)
        let cloneResponseInterceptors = responseInterceptors;
        responseInterceptors = (axiosInstance, res) => {
            let result;
            if (isFunction(cloneResponseInterceptors)) {
                result = cloneResponseInterceptors(axiosInstance, res) ?? res;
            }
            // f1: 重复请求
            if (axiosInstance?.config.requestOptions?.isDeduplication) {
                fetchCancelerCase.removePending(axiosInstance.config);
            }
            return result;
        };
        // 请求拦截器(错误)  	(failed)net::ERR_NAME_NOT_RESOLVED 域名前半段解析不了的时候，
        let cloneRequestInterceptorsCatch = requestInterceptorsCatch;
        requestInterceptorsCatch = (axiosInstance, error, res) => {
            if (axiosInstance?.config?.requestOptions?.retryRequest?.isOpenRetry) {
                // f2：失败重试
                retryRequest.retry(axiosInstance, error, res);
            }
            if (isFunction(cloneRequestInterceptorsCatch)) {
                cloneRequestInterceptorsCatch(axiosInstance, error);
            }
        };
        // 响应拦截器(错误) 404 的时候会走这个请求(fetch 的ok)
        let cloneResponseInterceptorsCatch = responseInterceptorsCatch;
        responseInterceptorsCatch = (axiosInstance, error, res) => {
            let isSuccessFn = false;
            let isErrorFn = false;
            if (isFunction(axiosInstance?.config?.requestOptions?.retryRequest?.successFn)) {
                isSuccessFn = true;
            }
            if (isFunction(axiosInstance?.config?.requestOptions?.retryRequest?.errorFn)) {
                isErrorFn = true;
            }
            if (axiosInstance?.config?.requestOptions?.retryRequest?.isOpenRetry) {
                // f2：失败重试
                retryRequest
                    .retry(axiosInstance, error, res)
                    .then((e) => {
                    if (isSuccessFn) {
                        axiosInstance?.config?.requestOptions?.retryRequest?.successFn(e);
                    }
                })
                    .catch((e) => {
                    if (isErrorFn) {
                        axiosInstance?.config?.requestOptions?.retryRequest?.errorFn(e);
                    }
                });
            }
            if (isFunction(cloneResponseInterceptorsCatch)) {
                cloneResponseInterceptorsCatch(axiosInstance, error);
            }
        };
        this.axiosInstance.setTransform({
            requestInterceptors,
            requestInterceptorsCatch,
            responseInterceptors,
            responseInterceptorsCatch,
        });
    }
    get(config) {
        return this.axiosInstance.request({ ...config, method: "GET" });
    }
    post(config) {
        return this.axiosInstance.request({ ...config, method: "POST" });
    }
    put(config) {
        return this.axiosInstance.request({ ...config, method: "PUT" });
    }
    delete(config) {
        return this.axiosInstance.request({ ...config, method: "DELETE" });
    }
}
let params = {
    params: {
        id: 5,
    },
    url: "/users/Electroluxcode",
    requestOptions: {
        retryRequest: {
            isOpenRetry: true,
            count: 3,
            waitTime: 1000,
            successFn(res) {
                console.log("重试成功:", {
                    res,
                });
            },
            errorFn(res) {
                console.log("重试失败:", {
                    res,
                });
            },
        },
    },
};
let test = new VAxios({
    responseOptions: {
        type: "json",
    },
    baseURL: "https://api.github.com",
    transform: {
        responseInterceptors(axiosInstance, res) {
            // return res.data;
            console.log("响应拦截器", res);
        },
        responseInterceptorsCatch(axiosInstance, error) { },
    },
});
// test.get(params);
test
    .get(params)
    .then((e) => {
    console.log("then:", e);
})
    .catch((e) => {
    console.log("catch:", e);
});
// export const mockAxios = (config: CreateAxiosOptions) => {
// 	console;
// };
