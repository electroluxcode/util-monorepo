# util-monorepo

本包是 工具库包，包括个人封装的 UI 库 和 工程化 等 工具

## 1. 怎么运行

本仓库是开发仓库，`npm install` 后，运行 `npm run dev` ，可以实时编译 ejs 和 cjs 的文件，内置库使用起来需要 `npm install @util-monorepo/ui` 然后进行引用即可

## 2.仓库说明

### 产物

**注意这部分命名规范全部是小写**

一般我们的输出有两种，一种是 webpack，一种是 webpack 打包

- ui：处理样式(自适应，自动滚动等)

- middleware：数据的连接类和处理类(例如责任链,策略模式)

- struct：数据结构或者思路的实现(lru,lfu,mini-redux,mini-rxjs 等)

- type：放一些好用的 ts 类型体操

- webapi：基于业务封装的 web api(例如上传前面的校验示例，预览，以及类似 canvas 的操作等等等)

主要是 `libraryTarget` 的对比

#### es6(浏览器)

- libraryTarget:“window” | “global” | “this” 意思就是在 libraryTarget 上面 注册一个 在 `webpack` 的 `output` 定义的 `library` 同名的

#### node

- libraryTarget:“commonjs”，在 export 对象上定义 library 设置的变量
- libraryTarget:“commonjs2”，直接用 module.export 导出 export
- libraryTarget:“amd”，在 define 方法上定义 library 设置的变量，不能用 script 直接引用，必须通过第三方模块 RequireJS 来时用

#### umd 原理

webpackUniversalModuleDefinition 模块会对环境进行判断

npm publish -access public

build "pnpm -r --filter=./\* run build"

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





## 3.开发者验证



package之间相互引用

```shell
pnpm add ../middleware
# 给 pv-html 安装 @util-monorepo/middleware 依赖
pnpm install @util-monorepo/middleware  -r --filter pv-html
# yaml 提前需要 写入 ,不然报错：No projects matched the filters 
#packages:
#  - "middleware/*"
#  - "ProjectValiate/*"
```

也可以用workspace 协议

- **workspace 协议**:如果可用的 packages 与已声明的可用范围相匹配，pnpm 将从工作区链接这些 packages,不然就会 去 npmjs.com 中 去查找 npmjs包，避免这个的方法就是 使用 workspace 协议 例如

  ```json
  {
      "foo": "workspace:2.0.0"
  }
  
  "dependencies": {
      "@util-monorepo/middleware": "workspace:*"
  }
  ```

  当 `单独` 对这个子包进行发包 `pnpm publish`的时候  workspace 会自动 替换

  

### 3.1 vue helloworld

### 3.1.1 安装依赖

```shell
pnpm add -w -D vite @vitejs/plugin-vue
```





#### 3.1.2  packageA 新建 vue.config.ts

写入

```ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
export default defineConfig({
  plugins: [vue()],
});

```







#### 3.1.3 index.html/index.ts



