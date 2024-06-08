/**
 *  @des 校验码
 */
import { easyFetch } from "./easyFetch.js";
export function fetchStatus(result) {
    switch (result.data?.code) {
        case 400:
            alert(400);
            break;
        case 401:
            alert(401);
            break;
        default:
            console.log("没有问题 或者没有code");
    }
}
// method + url 拼接成一个新的 作为key
// 用 浅复制的特性将 signal进行传递
let params = {
    params: {
        id: 5,
    },
    url: "/users/Electroluxcode",
    method: "get",
};
// let errorCa
let ba = new easyFetch({
    baseURL: "https://api.github.com",
    responseOptions: {
        type: "json",
    },
    requestOptions: {
        retryRequest: {
            count: 1,
            isOpenRetry: true,
            waitTime: 1000,
        },
    },
    transform: {
        responseInterceptors(axiosInstance, res) {
            fetchStatus(res);
        },
    },
});
ba.request(params).then((e) => {
    console.log(e);
});
