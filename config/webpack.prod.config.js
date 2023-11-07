/*
* webpack 配置
*/
let EntryPath = './template/webpack-template/index.ts'
let OutputPath = './template/webpack-template/index.ts'

let PackageName = "LoadingPlugin"

var path = require('path');
module.exports =[{   
    // mode : 'development',production
    mode:"production",
    entry:{
        // ../../template/webpack-template/index.ts
        [PackageName]:'./template/webpack-template/index.ts'
    },
    output: {
        publicPath:"",
        path: path.resolve(__dirname, '../dist'), //打包后的文件存放的地方
        filename: '[name].umd.min.js', //打包后输出文件的文件名
        library:"LoadingPlugin",  //类库名称。调用.import 的时候可以直接输出html的名字
        libraryTarget:"umd",  //指定输出格式 ejs commonjs umd amd
        // umdNamedDefine:true, //会对UMD的构建过程中的AMD模块进行命名，否则就使用匿名的define
    },
    resolve: {
        extensions: ['.ts','tsx'],
    },
    externals: {
        'fs': 'require("fs")'
    },
    module: {        
        rules: [
            {
                test:/\.ts?$/,
                use:'ts-loader',
                exclude: /node_modules/
            } 
        ]
    },
}
]