/*
* webpack配置打包
*/
var webpack = require('webpack');
var webpackConfig = require('./webpack.prod.config');

console.log(
  ' 温馨提示:\n' +  
  ' 正在打包中，请稍候。。。\n'
);

webpack(webpackConfig, function (err, stats) {  
  if (err) throw err
  //默认输出的到控制台的东西  
  process.stdout.write(stats.toString({
    colors: true,
    loggingTrace: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }) + '\n\n');
  if (stats.hasErrors()) {
    console.log(' Build failed with errors.\n')
    process.exit(1)
   }
  console.log(' \n打包结束\n');
});


