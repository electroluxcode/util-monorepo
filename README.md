# util-monorepo

本包是 工具库包，包括个人封装的 UI库 和 工程化 等 工具



## 1. 怎么运行

本仓库是开发仓库，`npm install` 后，运行 `npm run dev` ，可以实时编译ejs和cjs的文件，内置库使用起来需要 `npm install @util-monorepo/ui` 然后进行引用即可



## 2.仓库说明

### 产物

**注意这部分命名规范全部是小写**

一般我们的输出有两种，一种是webpack，一种是webpack 打包 


- ui：处理样式(自适应，自动滚动等)

- middleware：数据的连接类和处理类(例如责任链,策略模式)

- struct：数据结构或者思路的实现(lru,lfu,mini-redux,mini-rxjs等)

- type：放一些好用的ts类型体操

- webapi：基于业务封装的web api(例如上传前面的校验示例，预览，以及类似canvas的操作等等等)





主要是 `libraryTarget` 的对比

#### es6(浏览器)

- libraryTarget:“window” | “global” | “this” 意思就是在 libraryTarget上面 注册一个 在 `webpack` 的 `output` 定义的 `library` 同名的 



#### node

- libraryTarget:“commonjs”，在export对象上定义library设置的变量
- libraryTarget:“commonjs2”，直接用module.export导出export
- libraryTarget:“amd”，在define方法上定义library设置的变量，不能用script直接引用，必须通过第三方模块RequireJS来时用



#### umd原理

webpackUniversalModuleDefinition 模块会对环境进行判断





npm publish -access public


build "pnpm -r --filter=./* run build"





### 发布

如果想要成为发布者请联系仓库管理者，https://github.com/electroluxcode。或者你自己fork一份过去自己发布也可

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







