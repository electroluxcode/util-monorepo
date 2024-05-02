var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const http = require("http");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var payRouter = require("./routes/pay");
let https = require("https");
let fs = require("fs");

var SendMail = require("./config/email");
const multer = require("multer");
const schedule = require("node-schedule");
var app = express();
const bodyParser = require("body-parser");

let credentials = {
	key: fs.readFileSync("server.pem", "utf8"),
	cert: fs.readFileSync("server.crt", "utf8"),
};

let httpServer = http.createServer(app);
let httpsServer = https.createServer(credentials, app);

httpServer.listen("8098", () => {
	console.log("http://localhost:8098/");
});

httpsServer.listen("8099", () => {
	console.log("https://localhost:8099/");
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/pay", payRouter);

// 跨域
app.all("*", function (req, res, next) {
	res.setHeader("Access-Control-Allow-Origin", "*"); //的允许所有域名的端口请求（跨域解决）
	res.setHeader(
		"Access-Control-Allow-Headers",
		"X-Custom-Header,Cache-Control,Pragma"
	);
	// res.setHeader("Access-Control-Request-Headers", "id");
	// res.setHeader("Access-Control-Request-Headers", "*");
	res.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
	res.setHeader("Access-Control-Max-Age", "3600");
	res.setHeader("Access-Control-Allow-Credentials", "true");
	// 不带凭据的请求响应通配符
	res.setHeader("Access-Control-Expose-Headers", "*");
	// res.setHeader("server-test", '454545');
	console.log("--全局拦截--");
	// res.setHeader("Set-Cookie", 'iddddddd=a3f;SameSite=None');

	// HttpOnly; 前端无法操作
	// Secure https 才能访问
	// res.setHeader("Set-Cookie", "idd=a32222;Path=/;Secure;SameSite=None")

	// res.setHeader("Set-Cookie", "id=7sssd822;Path=/;Secure;SameSite=None;Domain=.baidu.com;")
	next();
});
app.use(bodyParser.text());

// 自动签到脚本
const JueJinSignIn = require("./signin/juejin");

const Sign = async () => {
	let log = {
		today: "今天要有一个好心情哦",
		juejin: "无数据",
	};
	// 1.juejin
	try {
		log["juejin"] = await JueJinSignIn();
	} catch {
		log["juejin"] = await JueJinSignIn();
	}

	let text = ``;
	// 组装
	for (let i in log) {
		text += `<li>${i}:${log[i]}</li>`;
	}
	let ResText = `<ul>${text}</ul>`;
	let ResTitle = `我的日志`;
	SendMail(ResTitle, "electroluxcode@gmail.com", ResText);
};
// 秒、分、时、日、月、周几
// '*'表示通配符，匹配任意，当秒是'*'时，表示任意秒数都触发，其它类推
schedule.scheduleJob("0 24 06 * * *", () => {
	setTimeout(() => {
		Sign(); //签到函数
	}, Math.random() * 10 * 60 * 1000);
});

// Sign();

//get 接受参数测试 注意 如果是get 那么option也不行
app.all("/api/get", function (req, res) {
	let query;
	let body;
	let cookie;
	cookie = req.headers.cookie;
	if (req.query) {
		query = JSON.parse(JSON.stringify(req.query));
		console.log("query:", query);
	}
	if (req.body) {
		body = JSON.parse(JSON.stringify(req.body));
		console.log("body:", body);
	}
	res.setHeader(
		"Set-Cookie",
		// id=7sssd822;Path=/;Secure;SameSite=None;Domain=.baidu.com;
		"id=7sssd822;Path=/;Secure;SameSite=None;"
	);
	// res.setHeader("Cache-Control", "max-age=2");
	setTimeout(() => {
		res.send({
			code: 2000,
			body,
			query,
			cookie,
		});
	}, 0);
});

//post 接收参数测试 application/json 的有效 {id:56}
app.post("/api/post", function (req, res) {
	// res.setHeader('Set-Cookie', 'servercookie=78787788')
	// res.location('http://baidu.com')
	// res.redirect(200, "http://baidu.com");
	// res.setHeader(
	// 	"Set-Cookie",
	// 	"id=7sssd822;Path=/;Secure;SameSite=None;Domain=.baidu.com;"
	// );
	// return
	// json 的才有效
	// res.setHeader("Cache-Control", "max-age=6");
	let query;
	let body;
	if (req.query) {
		query = JSON.parse(JSON.stringify(req.query));
		console.log("query:", query);
	}
	if (req.body) {
		body = JSON.parse(JSON.stringify(req.body));
		console.log("body:", body);
	}
	setTimeout(() => {
		res.send({
			code: 200,
			body,
			query,
		});
	}, 1000);
});
app.get("/api/signin", function (req, res) {
	Sign();
	res.send({
		code: 200,
		msg: "签到中",
	});
});
app.get("/api/sse", function (req, res) {
	// json 的才有效
	res.setHeader("Content-Type", "text/event-stream");
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Cache-Control", "max-age=10");
	res.setHeader("Connection", "keep-alive");

	const interval = setInterval(() => {
		res.write(`event:pin\n`);
		res.write("data:{id:4Data chunk}\n\n");
	}, 1000);

	// 3秒后停止输出
	setTimeout(() => {
		if (res.writableEnded) {
		} else {
			clearInterval(interval);
			res.write("data: Data end\n\n");
		}
	}, 3000);
});

const uploadsPath = path.resolve(__dirname, "./public");
const storage = multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, uploadsPath);
	},
	filename: function (req, file, callback) {
		const filename = req.headers["x-file-name"];
		callback(null, `${Date.now()}.jpg`);
		return;
	},
});
const upload = multer({ storage });
app.post("/api/file", upload.single("file"), (req, res) => {
	console.log("req", req.files);
	res.json({ url: `http://localhost:8088/public/${req.file}` });
});

// get 发送短信
// http://localhost:8088/api/email?subject=测试&to=electroluxcode@gmail.com&text=你好
app.get("/api/email", function (req, res) {
	if (req.query) {
		let data = JSON.parse(JSON.stringify(req.query));
		console.log(data);
		let {
			subject = "默认标题",
			to = "electroluxcode@gmail.com",
			text = `默认内容`,
		} = data;
		SendMail(subject, to, text, res);
	}
	// res.send({
	//   code:400,
	//   msg:"发短信失败",
	// });
});

app.get("/api/ip", function (req, res) {
	res.send({
		code: 200,
		msg: req.ip,
	});
});

/**
 * @method 获取客户端IP地址
 * @param {string} req 传入请求HttpRequest
 * 客户请求的IP地址存在于request对象当中
 * express框架可以直接通过 req.ip 获取
 */
function getClientIp(req) {
	return (
		req.headers["x-forwarded-for"] ||
		req.ip ||
		req.connection.remoteAddress ||
		req.socket.remoteAddress ||
		req.connection.socket.remoteAddress ||
		""
	);
}

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});
