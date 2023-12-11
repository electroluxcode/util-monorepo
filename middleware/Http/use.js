import { Http } from "./Http.js";
// import AbortRequest from "../AbortRequest/AbortRequest.js"
// const abortRequest = new AbortRequest();
// --------------------0.基础配置示例--------------------
Http.create({
    BaseUrl: "http://127.0.0.1:8088",
    TimeOut: 10000,
    Retry: 1,
    MaxConcurrent: 1,
    BeforeRequest: (config) => {
        // console.log("BeforeRequest配置:")
        // console.log(config)
        return config;
    },
    // 默认是json，但是自定义配置会取代掉他
    BeforeResponse: (config) => {
        console.log("BeforeResponse配置:", config);
        return config;
    },
});
// --------------------1.post 测试--------------------
// Http.BaseConfig.BeforeRequest = (config)=>{
//     console.log("config:",config)
//     return config
// }
// console.log(Http)
// Http.request({
//     url:"/api/post",
//     data:{
//         id:5656
//     },
//     method:"POST",
//     headers:{
//         // 不加 这行 就是 返回字符串
//         // "content-type":"application/json"
//     }
// }).then((e)=>{
//     return e.json()
// }).then((e)=>{
//     console.log("最终结果:",e)
// })
// --------------------2.get 测试 --------------------
// get 中 加上 Content-Type 也会被视为是 复杂请求触发 option 跨域
//  document.cookie ="id=7d822;Path=/;Secure;SameSite=None;Domain=baidu.com;"
document.cookie = "id=7d82222;Path=/;Secure;SameSite=None";
// Http.request({
//     url: "/api/post",
//     data: {
//         id: 5656588888
//     },
//     method:"GET",
//     headers: {
//         // "My-Header":5,
//         "Cookie":"ui=dark",
//         // "Content-Type":"application/json",
//     },
//     // test:{
//     //     id:5
//     // },
//     credentials:"include"
//     // wi
// }).then((e)=>{
//     console.log("http结果:",e)
//     console.log(document.cookie)
// }).catch((e)=>{
//     console.log("e23434",e)
// })
// ---------------------3.文件上传测试--------------------
let fileDom = document.querySelector("#file");
fileDom.addEventListener("change", async (e) => {
    const data = new FormData();
    data.append("file", e.target.files[0]);
    data.append("myParam", JSON.stringify({
        name: "xiaoming"
    }));
    console.log("我是上传得文件", data);
    Http.request({
        url: "/api/file",
        data: data,
        method: "POST",
        headers: {
        // 这玩意不用加.因为在实际开发中，浏览器会自动帮你加上 boundary
        // "Content-Type": 'multipart/form-data'
        },
    }).then((e) => {
        console.log("e:", e);
        return e;
    }).then((e) => {
        console.log("最终结果:", e);
        debugger;
    });
});
document.querySelector("button").addEventListener("click", () => {
    // @ts-ignore
    fileDom.click();
});
// ---------------------4. signal 测试--------------------
// let testSignal = abortRequest.create("signal测试");
// Http.request({
//     url: "/api/get",
//     data: {
//         id: 5656588888
//     },
//     signal: testSignal,
//     method: "GET",
//     headers: {
//         // "Content-Type":"application/json",
//     },
//     mode: 'cors'
// }).then((e) => {
//     console.log("e:", e)
//     return e.json()
// }).then((e) => {
//     console.log("最终结果:", e)
//     abortRequest.remove("signal测试")
// })
// setTimeout(() => {
//     testSignal = abortRequest.create("signal测试");
//     Http.request({
//         url: "/api/get",
//         data: {
//             id: 5656588888
//         },
//         signal: testSignal,
//         method: "GET",
//         headers: {
//             // "Content-Type":"application/json",
//         },
//     }).then((e) => {
//         console.log("e:", e)
//         return e.json()
//     }).then((e) => {
//         console.log("最终结果:", e)
//     })
// }, 3500);
// ---------------------5. sse 测试--------------------
// Http.request({
//     url: "/api/sse",
//     data: {
//         id: 5656588888
//     },
//     method: "GET",
//     headers: {
//         // "Content-Type":"application/json",
//     },
//     mode: 'cors'
// }).then(async (e) => {
//     console.log("e:", e)
//     const reader = e.body.getReader();
//     while (true) {
//         const { done, value } = await reader.read();
//         console.log(`Received  bytes`, done, value)
//         if (done) {
//             break;
//         }
//     }
// }).then((e) => {
//     console.log("最终结果:", e)
// })
// Http.request({
//     url: "/api/sse",
//     data: {
//         id: 5656588888
//     },
//     method: "GET",
//     headers: {
//         // "Content-Type":"application/json",
//     },
//     mode: 'cors'
// }).then(async (e) => {
//     console.log("e:", e)
//     const reader = e.body.getReader();
//     while (true) {
//         const { done, value } = await reader.read();
//         console.log(`Received  bytes`, done, value)
//         if (done) {
//             break;
//         }
//     }
// }).then((e) => {
//     console.log("最终结果:", e)
// })
//         Http.create({ BaseUrl: "https://dashscope.aliyuncs.com" })
//              Http.request({
//             url: "/api/v1/services/aigc/text-generation/generation",
//             data: {
//     "model": "qwen-turbo",
//     "input": {
//         "messages": [
//             {
//                 "role": "system",
//                 "content": "You are a helpful assistant."
//             },
//             {
//                 "role": "user",
//                 "content": "你好，哪个公园距离我最近？"
//             }
//         ]
//     },
// },
//             method: "POST",
//             headers: {
//                 "Authorization":"sk-9c9c0e52316647869f37dd97dc65669f",
//                 "Content-Type":"application/json"
//             },
//             mode: 'cors'
//         }).then(async (e) => {
//             return e.json()
//         }).then((e) => {
//             console.log("最终结果:", e)
//         })
