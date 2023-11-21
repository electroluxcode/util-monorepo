const axios = require("axios");




/**
 * 获取当前时间的格式化时间
 * @param {String} key 调用js日期函数字符串
 * @returns 当前时间格式化的字符串
 */

const JueJinSignIn = ()=>{
    let BaseConfig = {
        url: `https://api.juejin.cn/growth_api/v1/check_in`, //签到接口
        headers: {
          Referer: "https://juejin.cn/",
          "Upgrade-Insecure-Requests": 1,
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36",
          cookie: `__tea_cookie_tokens_2608=%257B%2522web_id%2522%253A%25227108356968017266215%2522%252C%2522user_unique_id%2522%253A%25227108356968017266215%2522%252C%2522timestamp%2522%253A1655043340721%257D; _ga=GA1.2.1537271624.1655043341; odin_tt=c7eb30a8846539e982021595c20a49d56c0565ecc7eb8362bbb0b58c7f150623cffda48fd99c9dab7ae37653cd2dd3a6159a4031b07ca8afacdff1801dd5550a; uid_tt=68a863905e65b97402899d456405370c; uid_tt_ss=68a863905e65b97402899d456405370c; sid_tt=7dcdc95ea45d20811a728b980c653b36; sessionid=7dcdc95ea45d20811a728b980c653b36; sessionid_ss=7dcdc95ea45d20811a728b980c653b36; sid_ucp_v1=1.0.0-KGU3Yjg5ZmVlZWFhM2Q3MmRjYWQzZDMxZDQxYmRhNWRmOTI0NGU0MzYKFwiow5D3_YyrBRCJ3febBhiwFDgCQOwHGgJsZiIgN2RjZGM5NWVhNDVkMjA4MTFhNzI4Yjk4MGM2NTNiMzY; ssid_ucp_v1=1.0.0-KGU3Yjg5ZmVlZWFhM2Q3MmRjYWQzZDMxZDQxYmRhNWRmOTI0NGU0MzYKFwiow5D3_YyrBRCJ3febBhiwFDgCQOwHGgJsZiIgN2RjZGM5NWVhNDVkMjA4MTFhNzI4Yjk4MGM2NTNiMzY; _tea_utm_cache_4366={%22utm_source%22:%221017tc%22}; passport_csrf_token=14d1c12eb1fcdf2699ec16615865aca4; passport_csrf_token_default=14d1c12eb1fcdf2699ec16615865aca4; store-region=cn-gd; store-region-src=uid; _tea_utm_cache_2608={%22utm_source%22:%22chajian%22%2C%22utm_medium%22:%22web%22%2C%22utm_campaign%22:%22jsjh%22}; _tea_utm_cache_2018={%22utm_source%22:%22chajian%22%2C%22utm_medium%22:%22web%22%2C%22utm_campaign%22:%22jsjh%22}; csrf_session_id=0e563ae771ebdb8ebd9ea1f218dadf2e; msToken=AAVhd23uUVC5taWY5ysdkmshOw3tBelPvrC6tAK3guIviy7l1mgmBbi2a-KYVji4g5iZJRHddoTX8Ew__dYEglLDGXMrDhIEDRfLcyyr4GRK9q0GwwjrTQEO9WZ_-oxWiQ==`, 
        },
    }
    return new Promise(async(resolve)=>{
        const res = await axios({
            url: BaseConfig.url,
            method: `post`,
            headers:BaseConfig.headers,
        });
        if(res && res.data) {
            resolve(`"掘金签到成功:"${JSON.stringify(res.data)}`)
        }else{
            resolve(`"掘金签到失败:"${JSON.stringify(res)}`)
        }
    })
    
 }

 module.exports = JueJinSignIn;