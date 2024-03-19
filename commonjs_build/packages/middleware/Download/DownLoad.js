"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadFile = void 0;
function downloadFile(url, fileName, fileType) {
    return fetch(url, {
        method: 'GET',
    })
        .then(response => response.blob())
        .then(blob => {
        const url = window.URL.createObjectURL(new Blob([blob], { type: fileType }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
    });
}
exports.downloadFile = downloadFile;
//   export function downloadExcel(url:string,filetype="xlsx") {
//     return instance({
//       url: url,
//         method: 'get',
//         responseType: 'blob', // 指定响应类型为二进制数据
//     }).then(response => {
//       const contentDisposition = response.headers['content-disposition'];
//       const match = contentDisposition && contentDisposition.match(/filename="(.+)"/);
//       const fileName = match ? match[1] : `报告${Date.now()}.${filetype}`;
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download',fileName); // 设置文件名
//       document.body.appendChild(link);
//       link.click();
//     });
//   }
