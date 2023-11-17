## 2.1.基础

fetch 的 第一个参数 是 url



第二个参数 是 一个 init 参数列表 {}

- method: 请求使用的方法，如 GET、POST。
- headers: 请求的头信息，形式为 Headers 的对象或包含 ByteString 值的对象字面量。
- body: 请求的 body 信息：可能是一个 Blob、BufferSource、FormData、URLSearchParams 或者 USVString 对象。注意 **GET 或 HEAD 方法的请求不能包含 body 信息。**
- mode: 请求的模式，如 cors、no-cors 或者 same-origin。
- credentials: 请求的 credentials，如 omit、same-origin 或者 include。为了在当前域名内自动发送 cookie，必须提供这个选项，从 Chrome 50 开始，这个属性也可以接受 FederatedCredential (en-US) 实例或是一个 PasswordCredential (en-US) 实例。
- cache: 请求的 cache 模式：default、 no-store、 reload 、 no-cache、
- redirect: 可用的 redirect 模式：follow (自动重定向), error (如果产生重定向将自动终止并且抛出一个错误），或者 manual (手动处理重定向)。在 Chrome 中默认使用 follow（Chrome 47 之前的默认值是 manual）。
- referrer: 一个 USVString 可以是 no-referrer、client 或一个 URL。默认是 client。
- integrity: 包括请求的 subresource integrity 值（例如： sha256-BpfBw7ivV8q2jLiT13fxDYAe2tJllusRSZ273h2nFSE=）。



## 2.2.辨析

### 2.2.1 mode | no-cors | cors  | same-origin

注意一下 get 请求 设置 content-type 也会触发跨域

- no-cors: 发送数据不返回数据

- #### cors：是默认参数

- #### same-origin：严格同源，不同源不发送东西



### 2.2.2  response 返回值对象 | 同步 | 异步 | 状态码混淆点

fetch 返回来的 是一个  `Response`,里面有同步属性 和 异步属性

**同步属性 有** 

- **status**
- ok
- type
  - `basic`：普通请求，即同源请求。
  - `cors`：跨域请求。
  - `error`：网络错误，主要用于 Service Worker。
  - `opaque`：如果`fetch()`请求的`type`属性设为`no-cors`，就会返回这个值，详见请求部分。表示发出的是简单的跨域请求，类似`<form>`表单的那种跨域请求。
  - `opaqueredirect`：如果`fetch()`请求的`redirect`属性设为`manual`，就会返回这个值，详见请求部分



**状态码 需要注意 只有网络错误或者无法链接的时候 fetch 才会报错，其他的时候都是请求成功。因此用户需要  自己进行判断**

```ts
async function fetchText() {
  let response = await fetch('/readme.txt');
  if (response.status >= 200 && response.status < 300) {
    return await response.text();
  } else {
    throw new Error(response.statusText);
  }
}
```



### 2.2.3 response 返回值对象 |  混淆点



**返回值对象有**

```ts
response.text()：得到文本字符串。
response.json()：得到 JSON 对象。
response.blob()：得到二进制 Blob 对象。
response.formData()：得到 FormData 表单对象。
response.arrayBuffer()：得到二进制 ArrayBuffer 对象。
```

但是问题是 只能读取一次，也就是说

```ts
let text =  await response.text();
let json =  await response.json();  // 报错
```

因此我们可以使用  `response.clone()` 克隆一个对象

```ts
const response2 = response1.clone();
let text =  await response2.text();
let json =  await response2.json();  // 报错
```



### 2.2.4 流式请求

```ts
const response = await fetch('flower.jpg');
const reader = response.body.getReader();

while(true) {
  const {done, value} = await reader.read();

  if (done) {
    break;
  }

  console.log(`Received ${value.length} bytes`)
}
```



### 2.2.5 cookie | **credentials**

是否发送cookie，在这个里面我并没有设置

- `same-origin`：默认值，同源请求时发送 Cookie，跨域请求时不发送。
- `include`：不管同源请求，还是跨域请求，一律发送 Cookie。
- `omit`：一律不发送。



### 2.2.6 **keepalive**

`keepalive`属性用于页面卸载时，告诉浏览器在后台保持连接，继续发送数据。

```ts
window.onunload = function() {
  fetch('/analytics', {
    method: 'POST',
    body: "statistics",
    keepalive: true
  });
};
```





### 2.2.7 integrity

作用是防止被篡改

```ts
integrity : 'sha256-abcdef'
```

Math.random().toString(16).slice(-8)

这里经过实操，只能 用静态资源。并且 用 [https://www.srihash.org/](https://link.zhihu.com/?target=https%3A//www.srihash.org/)   生成资源才行

## 2.3 处理返回

```ts
// response.text() //读文本
// response.json() //读json
// response.blob() // Blob 对象
// response.formData() // FormData 表单对象。
// response.arrayBuffer() // 得到二进制 ArrayBuffer 对象

// Response.ok //请求是否成功
// Response.status //表示 HTTP 回应的状态码
// Response.statusText //一个字符串，表示 HTTP 回应的状态信息
```







