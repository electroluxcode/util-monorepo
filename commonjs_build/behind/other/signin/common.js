const getNowTime = () => {
    let nowTime = ``;
    try {
        nowTime = new Date()["toLocaleTimeString"]();
    }
    catch (e) {
        nowTime = `获取时间函数错误！`;
        console.error(`请传入日期函数 —— ${e}`);
    }
    return nowTime;
};
module.exports = getNowTime;
