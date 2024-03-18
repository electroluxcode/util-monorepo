const axios = require("axios");
/**
 * 获取当前时间的格式化时间
 * @param {String} key 调用js日期函数字符串
 * @returns 当前时间格式化的字符串
 */
const JueJinSignIn = () => {
    let BaseConfig = {
        url: `https://api.juejin.cn/growth_api/v1/check_in`, //签到接口
        headers: {
            Referer: "https://juejin.cn/",
            "Upgrade-Insecure-Requests": 1,
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36",
            cookie: `
          __tea_cookie_tokens_2608=%257B%2522web_id%2522%253A%25227108356968017266215%2522%252C%2522user_unique_id%2522%253A%25227108356968017266215%2522%252C%2522timestamp%2522%253A1655043340721%257D; _ga=GA1.2.1537271624.1655043341; _tea_utm_cache_4366={%22utm_source%22:%221017tc%22}; store-region=cn-gd; store-region-src=uid; _tea_utm_cache_2018={%22utm_source%22:%22pop_corner%22%2C%22utm_medium%22:%22web_entrance%22}; odin_tt=4b3eb77d6c675466c38cba7c1dc19c89ea74556df839fc3ae0f2b8ad0ca7791cc951543d17477750420689afb6f0703f169cccd89fddfe099594f5ca0723fbd9; n_mh=UbOHm1jDcBIsDVOE3CGifagV-WUtvE9S79IrF6XcGh4; passport_auth_status=138b3a105afba0c6ca06214478ae81cf%2C6eaa95c1597cd1e26b57a3fc361ad9df; passport_auth_status_ss=138b3a105afba0c6ca06214478ae81cf%2C6eaa95c1597cd1e26b57a3fc361ad9df; sid_guard=6a06bc4de14a24469ed198fa16c0e083%7C1703486560%7C31536000%7CTue%2C+24-Dec-2024+06%3A42%3A40+GMT; uid_tt=692f55356e5b29cecdd87f4f62964ebc; uid_tt_ss=692f55356e5b29cecdd87f4f62964ebc; sid_tt=6a06bc4de14a24469ed198fa16c0e083; sessionid=6a06bc4de14a24469ed198fa16c0e083; sessionid_ss=6a06bc4de14a24469ed198fa16c0e083; sid_ucp_v1=1.0.0-KDEzZDdkY2VmZGVkM2FiODVkMDhiZmQ5YjY4NTE3NzNlZmNlZDgxNDYKFwiow5D3_YyrBRDgyKSsBhiwFDgCQPEHGgJobCIgNmEwNmJjNGRlMTRhMjQ0NjllZDE5OGZhMTZjMGUwODM; ssid_ucp_v1=1.0.0-KDEzZDdkY2VmZGVkM2FiODVkMDhiZmQ5YjY4NTE3NzNlZmNlZDgxNDYKFwiow5D3_YyrBRDgyKSsBhiwFDgCQPEHGgJobCIgNmEwNmJjNGRlMTRhMjQ0NjllZDE5OGZhMTZjMGUwODM; _tea_utm_cache_2608={%22utm_campaign%22:%22annual_2023%22}; csrf_session_id=259675b771256cc9c79b4df56763e471; msToken=daUXhf4SsaSGkYAEBpslGK_G2w79shqwAiyVsgCRE589RS4OtYjS0Elt-AagmEopAr6V_WIMBVD_Z2Jb7Ef1A9tymnDRNbNwW7O--HiMDuFd14HJB5GunAEkK-tnUZw=`,
        },
    };
    return new Promise(async (resolve) => {
        const res = await axios({
            url: BaseConfig.url,
            method: `post`,
            headers: BaseConfig.headers,
        });
        if (res && res.data) {
            resolve(`"掘金签到成功:"${JSON.stringify(res.data)}`);
        }
        else {
            resolve(`"掘金签到失败:"${JSON.stringify(res)}`);
        }
    });
};
module.exports = JueJinSignIn;
