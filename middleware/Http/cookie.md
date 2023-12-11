
### 基础操作 

document.cookie = "name=oeschger";
document.cookie = "favorite_food=tripe";

会累加起来


### 跨域问题



#### 请求跨域

有两种方案，一般来说我是是前者
- 将Cookie的SameSite值设为None，Secure值改为true，并且升级为https，我们就可以跨域使用Cookie。
- 将Cookie的SameSite值设为Lax/Strict，并且将前后端部署在同一台服务器下，我们就可以在同一站点使用Cookie

#### path 次域名跨域 | cookie Domain

通过设置cookie Domain 只能解决主域名相同的 跨子域名的跨域问题。例如将cookie的domain设置为.zlj.cn；name a.zlj.com b.zlj.cn等都能访问此cookie。

但是此法无法解决跨主域名的的问题。



#### nginx 反向代理 跨域



```shell
location /proxy_path {
    proxy_pass   http://zhoulujun.cn/project;
    proxy_cookie_path  /project /proxy_path;
    # proxy_cookie_domain b.zlj.com  a.zlj.com;#如果cookie没有设置domain，无需配置（一般情况没有配置）
}
```






### 设置 cookie 
- 服务器 set cookie 来设置 cookie 


```
res.setHeader("Set-Cookie", "idd=a32222;Path=/;Secure;SameSite=None")
```

前端想要自定义发送 cookie 需要
```html
document.cookie ="idd2323=a32222;Path=/;Secure;SameSite=None"
```

secure 看起来没有用的原因是 secure尽管它永远不会使用不安全的 HTTP 发送。但是本地主机除外

- 客户端 通过 document.cookie 来设置 cookie



浏览器会阻止前端 JavaScript 代码访问 Set-Cookie 标头。

- Expires=<date> 
cookie 的最长有效时间.
如果没有设置这个属性，那么表示这是一个会话期 cookie。一个会话结束于客户端被关闭时，这意味着会话期 cookie 在彼时会被移除。

- Max-Age=<number> 

- Domain=<domain-value> 可选
指定 cookie 可以送达的主机名。

假如没有指定，那么默认值为当前文档访问地址中的主机部分（但是不包含子域名）。

与之前的规范不同的是，域名（.example.com）之前的点号会被忽略。

多个主机/域名的值是不被允许的，但如果指定了一个域，则其子域也会被包含。

- path
指定一个 URL 路径，这个路径必须出现在要请求的资源的路径中才可以发送 Cookie 标头。

- secure 
一个带有安全属性的 cookie 只有在请求使用 https: 协议（localhost 不受此限制）的时候才会被发送到服务器。以阻止中间人攻击。


- httponly 
阻止 访问。但是初始化的请求还是会发送




cookiestore chrome 87 才有



### cookie 生命周期

Cookie 的生命周期可以通过两种方式定义：

- 会话期 Cookie 会在当前的会话结束之后删除。浏览器定义了“当前会话”结束的时间，一些浏览器重启时会使用会话恢复。这可能导致会话 cookie 无限延长。
- 持久性 Cookie 在过期时间（Expires）指定的日期或有效期（Max-Age）指定的一段时间后被删除。



### 服务器头部定义

#### Access-Control-Allow-Credentials | credentials
当请求的 credentials 模式（Request.credentials）为 include 时，浏览器仅在响应标头 Access-Control-Allow-Credentials 的值为 true 的情况下将响应暴露给前端的 JavaScript 代码。

#### Access-Control-Allow-Headers
添加自定义 头部报错 
cors,这是因为 前端再自定义 header之后需要在 后端 添加 Access-Control-Allow-Headers :"你的header"


#### Access-Control-Allow-Origin | creditial 

creditial 需要携带的时候，Access-Control-Allow-Origin 设置成 * 是没有用的，必须要具体的 请求 域名



