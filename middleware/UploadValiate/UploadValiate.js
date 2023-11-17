export const DefalutUploadConfig = {
    Safe: {
        accept: ['jpg', 'png'],
        maxCount: 1,
        formatTitle: '',
        limit: function (e) {
            console.log(e);
            const file = e;
            // const maxFileSize = 100 * 1024; // 100kb
            const maxFileSize = 1024 * 1024 * 10; // 10m
            // 1 * 1024 * 1024 * 1024; // 1G
            const fileSize = file.size || 0;
            const fileType = file.type || '';
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const that = this;
            return new Promise((resolve) => {
                const suffix = file?.name?.split(".")?.at(-1);
                console.log(suffix, file);
                if (fileSize > maxFileSize) {
                    resolve(`大小不能超过10m`);
                }
                else if (!that.accept.includes(suffix)) {
                    resolve(`格式不支持`);
                }
                resolve('');
                // const img = new Image();
                // img.src = window.URL.createObjectURL(file);
                // img.onload = () => {
                //   console.log("校验信息:", fileSize, fileType)
                //   if (img.width < 192 || img.height < 192) {
                //     resolve(`图标尺寸不能小于192*192PX`);
                //   }
                //   else if (fileSize > maxFileSize) {
                //     resolve(`上传图片不能超过10张`);
                //   } else {
                //     resolve('');
                //   }
                // };
                // img.onerror = () => {
                //   resolve(`读取失败`);
                // };
            });
        },
    },
};
