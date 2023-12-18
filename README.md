# util-monorepo



## 1.技术选型

### webpack or ts 

按照我以前的开发习惯，npm包都是要打包成 webpack 进行工程化输出的.

但是这个仓库不太一样。由于是工具库包，因此 webpack 打包 和 ts 直接输出的 js文件允许共存(简单输出的和复杂输出的允许共存)



## 2.开发规范



### 文件组织格式

#### 开发主目录文件夹

**注意这部分命名规范全部是小写**


- ui：处理样式(自适应，自动滚动等)

- middleware：数据的连接类和处理类(例如责任链,策略模式)

- struct：数据结构或者思路的实现(lru,lfu,mini-redux,mini-rxjs等)

- type：放一些好用的ts类型体操

- webapi：基于业务封装的web api(例如上传前面的校验示例，预览，以及类似canvas的操作等等等)



#### 子功能文件夹

**注意这部分命名规范是大驼峰**

例如说你想你想要新增一个 子功能，这是一个关于缓存数据的 hook。那么你可以 先判断 他是属于哪一个主文件夹。根据上面的信息，应该是 属于 `middleware` 类。

因此我们在` middleware `新建一个 文件夹 `Cache`,里面写入 `Cache.ts` 然后写入你的逻辑就可以了。



特别的 `type`文件夹是一个例外，这里面你不需要繁琐的新建文件夹，直接新建文件即可





### 发布

如果想要成为发布者请联系仓库管理者，https://github.com/electroluxcode。否则请等大版本发布

#### 普通版本

一般我们这个包中的发包时通过下面命令进行发包

```shell
node VersionUpdate.js && npm publish -access public
```



#### beta 版本 

- 解释和发布 :beta 版本供内部测试的版本

  ```shell
  node VersionUpdate.js && npm publish --tag beta -access public
  ```

- 安装

  ```shell
  npm install  包@beta 
  ```

  

#### 锁定版本





#### 指定发布

```shell
"publishConfig": {
    "registry": "http://registry.npm.xxx.com/"
 }
```





## 3.产物

主要是 `libraryTarget` 的对比

### es6(浏览器)

- libraryTarget:“window” | “global” | “this” 意思就是在 libraryTarget上面 注册一个 在 `webpack` 的 `output` 定义的 `library` 同名的 



### node

- libraryTarget:“commonjs”，在export对象上定义library设置的变量
- libraryTarget:“commonjs2”，直接用module.export导出export
- libraryTarget:“amd”，在define方法上定义library设置的变量，不能用script直接引用，必须通过第三方模块RequireJS来时用



### umd原理

webpackUniversalModuleDefinition 模块会对环境进行判断





npm publish -access public


build "pnpm -r --filter=./* run build"

