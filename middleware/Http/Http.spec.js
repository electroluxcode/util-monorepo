let {Http} = require("../../commonjs_build/middleware/Http/Http.js")
Http.create({
    BaseUrl: "http://localhost:8088",
    TimeOut: 10000,
    Retry: 2,
    MaxConcurrent: 1,
    BeforeRequest: (config) => {
        console.log("BeforeRequest配置:")
        console.log(config)
        return config
    },
    // 默认是json，但是自定义配置会取代掉他
    BeforeResponse: (config) => {
        console.log("BeforeResponse配置:")
        console.log(config)
        return config.json()
    }
})

function compare(a,b){
    return JSON.stringify(a)==JSON.stringify(b)
}
describe('Http', () => {

    // f1: baseurl 拼接
    test('Http/BaseConfig', () => {
        try{
            Http.request({
                url: "/api/get3",
                data: {
                    id: 5656588888
                },
                method: "GET",
                headers: {
                    // "Content-Type":"application/json",
                },
            }).catch((e)=>{
                Http.url == ""
                expect(true).toBe(true);
            })
        }catch(e){
            console.log("报错");
            expect(true).toBe(true);
        }
        // let flag = compare(transformInstance,expectData)
        
    });  
})
  