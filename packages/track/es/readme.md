# es 提案

浏览器环境中

- JavaScript = ECMAScript + WebApis(BOM + DOM）

node环境中

- 在 `node` 环境中，`JavaScript = ECMAScript + NodeApis(fs,net等)`



文档

- https://tc39.es/ecma262/multipage/managing-memory.html#sec-finalization-registry-constructor
- https://github.com/tc39/proposals/blob/main/finished-proposals.md
- 

# ![image](http://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/69af7210b15e435c9a9894d1541eb507~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)



es2024

- withResolve

- string关于emoji的处理 | isWellFormed

  - ```ts
    const strings = [
      // 单独的前导代理
      "ab\uD800",
      "ab\uD800c",
      // 单独的后尾代理
      "\uDFFFab",
      "c\uDFFFab",
      // 格式正确
      "abc",
      "ab\uD83D\uDE04c",
    ];
    
    for (const str of strings) {
      console.log(str.toWellFormed());
    }
    
    ```

    

