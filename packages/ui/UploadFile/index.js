/**
 * @des 用于不依赖于antd的文件上传
 * @usage
  let {registerUpload, disposeUpload, emitUpload } = genFileUpload({
  clickRef: document.querySelector("button"),
    emitFn: (file) => {
      console.log("file:ddd", file);
    },
  });
 * @param obj
 * @returns
 */
let genFileUpload = (obj) => {
    let { emitFn } = obj;
    if (!emitFn) {
        return;
    }
    const genUUid = () => {
        return "id_" + Math.random().toString(36).slice(-8);
    };
    let uuid = genUUid();
    let upload = document.createElement("input");
    upload.setAttribute("type", "file");
    upload.setAttribute("id", uuid);
    upload.style = "display:none";
    document.body.append(upload);
    const dispose = () => {
        upload.removeEventListener("change", fn);
        upload.remove();
    };
    let fn = (e) => {
        emitFn(e.target.files);
    };
    const register = () => {
        upload.addEventListener("change", fn);
    };
    const emitUpload = () => {
        upload.click();
    };
    return {
        registerUpload: register,
        disposeUpload: dispose,
        emitUpload,
    };
};
let { registerUpload, disposeUpload, emitUpload } = genFileUpload({
    emitFn: (file) => {
        console.log("file:ddd", file);
    },
});
registerUpload();
document.querySelector("button").addEventListener("click", () => {
    emitUpload();
});
