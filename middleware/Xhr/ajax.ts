interface AjaxRequest {
    method: 'GET' | 'get' | 'POST' | 'post'
    url: string
    data?: any // post
}

interface AjaxResponse {
    [prop: string]: any
}
/**
 * @des 跨域请求 | 简单和带预检请求 都可以
 * @param options 
 * @returns 
 */
async function ajax(options: AjaxRequest): Promise<AjaxResponse> {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const method = options.method.toUpperCase();
        xhr.onreadystatechange = () => {
            // xhr.readyState == 4 请求已完成，且响应已就绪
            if (xhr.readyState !== 4 || xhr.status === 0) return;
            const responseData: AjaxResponse = JSON.parse(xhr.response);
            // 当 readyState 等于 4 且status为 200 时，表示响应已就绪：
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(responseData);
            } else {
                reject(`request failed with status code ${xhr.status}`);
            }
        };
        
        if (method === 'GET') {
            let str = "?"
            let param = options.data
            for(let i in param){
                
                str += (str=="?")?`${i}=${param[i]}`: `&${i}=${param[i]}`
            }
            xhr.open(method, options.url+str, true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send(options.data);
        }

        if (method === 'POST') {
            xhr.open(method, options.url, true);
            // 经过测试，这个可以带。但是要求这个接口支持option的传参
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.send(JSON.stringify(options.data));
        } 

       
    });
}
let option :AjaxRequest= {
    method:"POST",
    url:"http://127.0.0.1:8088/api/post",
    data:{
        id:"ddddd"
    }
}
ajax(option).then((e)=>{
    console.log(e)
})
// export default ajax
export default {} 