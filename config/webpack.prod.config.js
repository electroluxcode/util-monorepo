/*
 * webpack 配置 注意路径是以 调用的地方作为 开始结束 的
 */

// 输入文件相对路径
let EntryPath = "./template/webpack-template/index.ts";
// 输出文件不知道为什么
let OutputPath = "../dist";

let PackageName = "LoadingPlugin";

var path = require("path");
module.exports = 
	{
		mode: "production",
		entry: {
			[PackageName]: EntryPath,
		},
		output: {
			publicPath: "",
			path: path.resolve(__dirname,OutputPath), //打包后的文件存放的地方
			filename: "[name].umd.min.js", //打包后输出文件的文件名
			library: PackageName, //类库名称。调用.import 的时候可以直接输出html的名字
			libraryTarget: "umd", //指定输出格式 ejs commonjs umd amd
			// umdNamedDefine:true, //会对UMD的构建过程中的AMD模块进行命名，否则就使用匿名的define
		},
		resolve: {
			extensions: [".ts", "tsx"],
		},
		externals: {
			fs: 'require("fs")',
		},
		module: {
			rules: [
				{
					test: /\.ts?$/,
					use: "ts-loader",
					exclude: /node_modules/,
				},
			],
		},
	}
    

