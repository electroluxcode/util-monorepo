// const axios = require('axios')
var nodemailer = require("nodemailer");
// function getApi(address) { return new Promise((resolve) => { axios .get('https://restapi.amap.com/v3/geocode/geo', { params: { key: '02173ea51a9245ef63966988c96a3a67', address, }, }) .then((resX) => { axios .get('https://restapi.amap.com/v3/weather/weatherInfo', { params: { key: '02173ea51a9245ef63966988c96a3a67', city: +resX.data.geocodes[0].adcode, }, }) .then((res) => { resolve(res.data) }) }) }) }
/**
 *
 * @param {*} subject 主体
 * @param {*} to 目标
 * @param {*} text 内容
 */
async function SendMail(subject, to, text, res) {
    // let params = "广东省广州市天河区";
    // let res = await getApi(params)
    // console.error("天气：", res.lives[0].temperature)
    // 创建一个SMTP客户端配置
    var config = {
        host: "smtp.qq.com", //网易163邮箱 smtp.163.com
        port: 465, //网易邮箱端口 25
        auth: {
            user: "3451613934@qq.com", //邮箱账号
            pass: "exhpspuprkyecidd", //邮箱的授权码
        },
    };
    // 创建一个SMTP客户端对象
    var transporter = nodemailer.createTransport(config);
    // 发送邮件
    function send(mail) {
        transporter.sendMail(mail, function (error, info) {
            console.log("mail sent:", info.response);
            if (error) {
                res.send({
                    code: 400,
                    msg: "发短信失败",
                });
                return console.log(error);
            }
            res.send({
                code: 200,
                msg: "发短信成功",
            });
            console.log("mail sent:", info.response);
        });
    }
    // 创建一个邮件对象
    var mail = {
        // 发件人
        from: "3451613934@qq.com",
        // 主题
        subject: subject,
        // 收件人
        to: to,
        // 邮件内容，HTML格式
        text: text, //可以是链接，也可以是验证码
    };
    send(mail);
}
module.exports = SendMail;
