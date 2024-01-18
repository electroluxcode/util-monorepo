var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const http = require("http");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var SendMail = require("./config/email");
const multer = require("multer");
const schedule = require("node-schedule");
var app = express();
const bodyParser = require("body-parser");

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

// 跨域
app.all("*", function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "http://127.0.0.1:5501"); //的允许所有域名的端口请求（跨域解决）
	res.header(
		"Access-Control-Allow-Headers",
		"content-type,Token,X-Requested-With,Content-Type,My-Header"
	);
	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
	res.setHeader("Access-Control-Max-Age", "3600");
	res.setHeader("Access-Control-Allow-Credentials", "true");
	// 不带凭据的请求响应通配符
	res.setHeader("Access-Control-Expose-Headers", "*");
	// res.setHeader("server-test", '454545');
	console.log("经过");
	// res.setHeader("Set-Cookie", 'iddddddd=a3f;SameSite=None');

	// HttpOnly; 前端无法操作
	// Secure https 才能访问
	// res.setHeader("Set-Cookie", "idd=a32222;Path=/;Secure;SameSite=None")

	// res.setHeader("Set-Cookie", "id=7sssd822;Path=/;Secure;SameSite=None;Domain=.baidu.com;")
	next();
});
app.use(bodyParser.text());

//get 接受参数测试
app.get("/api/get", function (req, res) {
	if (req.query) {
		let data = JSON.parse(JSON.stringify(req.query));
		console.log(data);
	}
	setTimeout(() => {
		res.send({
			code: 200,
			msg:
				Math.random() +
				`
      ddddddddddddddddd
      `,
		});
	}, 1000);
});

//post 接收参数测试 application/json 的有效 {id:56}
app.all("/api/post", function (req, res) {
	// res.setHeader('Set-Cookie', 'servercookie=78787788')
	// res.location('http://baidu.com')
	res.redirect(200, "http://baidu.com");
	res.setHeader(
		"Set-Cookie",
		"id=7sssd822;Path=/;Secure;SameSite=None;Domain=.baidu.com;"
	);
	// return
	// json 的才有效
	res.send({
		code: 300,
		msg: "post_success",
		data: req.body,
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
});

app.listen("8090", () => {
	console.log("8090");
});

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

module.exports = app;
