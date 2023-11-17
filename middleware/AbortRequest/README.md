# AbortRequest | axios

支持axios 和 promise 的 请求取消




## 1.1 初始化


```js
const abortRequest = new AbortRequest()
```

## 1.2 请求拦截器

给 `abortRequest ` 对象 初始化` key`, `value`

注意get post 在拦截器中是一样的

```ts
let keyvalueAbort = (url,data)=>{
  return JSON.stringify({url})
}
abortRequest.create(keyvalueAbort(config.url,config.data), {})
config.signal = abortRequest.list.get(keyvalueAbort(config.url,config.data))?.signal
```



## 1.3 响应拦截器

给 `abortRequest ` 对象 初始化` key`, `value`

注意get post 在拦截器

- get 中：response.config.param 是完整的 数据请求(object格式的)
- post：这个的格式不同，是string 格式的，见鬼了，这里需要做特殊处理

```ts
const abortRequest = new AbortRequest()
let keyvalueAbort = (url,data)=>{
  return JSON.stringify({url,data})
}
service.interceptors.response.use(
    response => {
        const res = response.data
        const config = response.config;
        console.log('响应成功config:', abortRequest.list.has(keyvalueAbort(config.url,config.data)))
        config.data = config.method == "post" ? JSON.parse(config.data) : config.data
        abortRequest.list.delete(keyvalueAbort(config.url,config.data))
        return res
    },
    error => {
        console.log('err' + error) // for debug
        return Promise.reject(error)
    }
```





## 1.4 完整示例







### 1.4.1 axios

```ts
import axios from 'axios'
import AbortRequest from './Enhance/AbortRequest'

// step1:创建中断请求控制器
const abortRequest = new AbortRequest()
let keyvalueAbort = (url,data)=>{
  return JSON.stringify({url,data})
}


// 创建axios实例
const service = axios.create({
  baseURL: "/MyDemo", // api 的 base_url
  timeout: 50000, // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    let Authorization = "";
    if (Authorization) {
      config.headers['Authorization'] = Authorization // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    abortRequest.create(keyvalueAbort(config.url,config.data), {})
    config.signal = abortRequest.list.get(keyvalueAbort(config.url,config.data))?.signal
    return config
  },
  error => {
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    const config = response.config;
 	// 重要：这里是主逻辑
    config.data = config.method == "post" ? JSON.parse(config.data) : config.data
    abortRequest.list.delete(keyvalueAbort(config.url,config.data))
    return res
  },
  error => {
    console.log('err' + error) // for debug
    return Promise.reject(error)
  }
)
export default service

```







### 1.4.2 AbortRequest

```ts
/**
 * @des 请求中断:在上一个相同请求还没有得到响应前，再次请求，则会自动中断
 * @tip key值的设计需要格外注意
 * @use  
    let a =new AbortRequest()
    //如果key 相同那么就移除
    a.create(key,{})
 */
class AbortRequest {
    list: Map<any, any>
    constructor() {
        // 请求中断控制器集合
        this.list = new Map()
    }
    // 创建中断请求控制器
    create(key, config) {
        const controller = new AbortController();
        console.log(this.list,key,this.list.has(key))
        //   config.signal = controller.signal
        // 集合中存在当前一样的请求，直接中断
        if (this.list.has(key)) {
            this.list.get(key)?.abort()

            console.log("--请求相同,直接中断--", this.list)
        } else {
            console.log("--继续执行--")
            this.list.set(key, controller)
        }
    }
    // 请求完成后移除集合中的请求
    remove(key) {
        this.list.delete(key)
    }
}
export default AbortRequest

```



### 1.4.3 函数使用

```ts
import MyDemo from "../services/MyDemoEnhance";

export function ModelChatGet(data:any) {
    return MyDemo({
      url: "/api/get",
      method: "get",
      params: data,
    });
  }


  export function ModelChatPost(data:any) {
    
    return MyDemo({
      url: "/api/post",
      method: "post",
      data: data,
      headers:{
        "Content-Type":"application/json"
      }
    },);
  }

```



# AbortRequest | fetch

这个比较简单，直接放代码

```ts
 import AbortRequest from "./AbortRequest.js"
        const abortRequest = new AbortRequest();

        const fetchData = (key, url) => {
            const controllerSignal = abortRequest.create(key);

            return new Promise(async (resolve, reject) => {
                try {
                    const response = await fetch(url, { signal: controllerSignal });
                    const data = await response.json();
                    abortRequest.remove(key);
                    resolve(data);
                } catch (error) {
                    
                }
            });
        };

        // 使用示例
        const key = 'example-key';
        const url = 'http://localhost:8088/api/post';

        const promise = fetchData(key, url);

        // 在需要的时候中断 Promise
        abortRequest.create(key); // 调用这行代码来中断请求

        promise
            .then((data) => console.log('Response:', data))
            .catch((error) => console.error('Error:', error.message));
```









# 并发示例 





```ts

let count  = 3
let now = 0
async function pauseIfNeeded() {
   while (now>=count) { // 当暂停状态为 true 时，等待恢复
     console.log("暂停中")
     await new Promise(resolve => setTimeout(resolve, 1000));
    }
 }


service.interceptors.request 中
await pauseIfNeeded()
now++

service.interceptors.response 中
now--
```























