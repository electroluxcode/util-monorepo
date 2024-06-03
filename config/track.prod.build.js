/*
 * webpack 配置 注意路径是以 调用的地方作为 开始结束 的
 */

/*
 * webpack配置打包
 */
var webpack = require("webpack");

// 输入文件相对路径
let EntryPath = "./packages/track/core/use.ts";
// 输出文件路径
let OutputPath = "./dist/track";

let PackageName = "track";

var path = require("path");
let baseConfig = [
	{
		// mode: "production", development
		mode: "production",
		entry: {
			[PackageName]: EntryPath,
		},
		output: {
			publicPath: "",
			path: path.resolve(__dirname, OutputPath), //打包后的文件存放的地方
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
	},
	{
		// mode: "production",
		mode: "development",
		entry: {
			[PackageName]: EntryPath,
		},
		output: {
			publicPath: "",
			path: path.resolve(__dirname, OutputPath), //打包后的文件存放的地方
			filename: "[name].window.min.js", //打包后输出文件的文件名
			library: PackageName, //类库名称。调用.import 的时候可以直接输出html的名字
			libraryTarget: "window", //指定输出格式 ejs commonjs umd amd
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
	},
];

console.log(" 温馨提示:\n" + " 正在打包中，请稍候。。。\n");

webpack(baseConfig, function (err, stats) {
	if (err) throw err;
	//默认输出的到控制台的东西
	process.stdout.write(
		stats.toString({
			colors: true,
			loggingTrace: true,
			modules: false,
			children: false,
			chunks: false,
			chunkModules: false,
		}) + "\n\n"
	);
	if (stats.hasErrors()) {
		console.log(" Build failed with errors.\n");
		process.exit(1);
	}
	console.log(" \n打包结束\n");
});
