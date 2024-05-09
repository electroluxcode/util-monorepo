let data = {
    msg: "操作成功",
    code: 200,
    data: {
        envEquipType: {
            dictName: "环境设备细分",
            multiValue: [
                {
                    valueName: "设备0",
                    valueNameEn: "device 0 ",
                    value: "00",
                },
                {
                    valueName: "设备1",
                    valueNameEn: "device 1 ",
                    value: "01",
                },
            ],
        },
    },
};
let dictManagementList = () => {
    return new Promise((resolve) => {
        resolve(data);
    });
};
/**
 * @des 返回是否需要缓存,true就走缓存
 * @time 指定过期时间
 * @key 指定过期key
 */
function needCache({ time = 5 * 1000, key }) {
    let cacheTime;
    let nowTime = new Date().getTime();
    try {
        cacheTime = localStorage.getItem(key);
        // 没有
        if (!cacheTime) {
            localStorage.setItem(key, String(new Date().getTime()));
            return false;
        }
        cacheTime = Number(cacheTime);
        let isExpire = nowTime - cacheTime > time;
        if (isExpire) {
            localStorage.setItem(key, String(new Date().getTime()));
            console.warn("key-isExpire过期:", isExpire);
            return false;
        }
        else {
            return true;
        }
    }
    catch {
        return true;
    }
}
/**
 *
 * @param cache
 * @param timeExpire 默认过期时间3小时
 * @returns
 */
export const useDict = async (timeExpire = 1000 * 3) => {
    let res;
    // 缓存过期时间比较
    // 加一层缓存
    try {
        if (needCache({ time: timeExpire, key: "useDictTime" })) {
            console.warn("缓存命中");
            res = localStorage.getItem("useDict");
        }
        else {
            res = await dictManagementList();
            localStorage.setItem("useDict", JSON.stringify(res));
        }
        res = JSON.parse(res);
    }
    catch {
        res = await dictManagementList();
        localStorage.setItem("useDict", JSON.stringify(res));
    }
    // f1:返回的是指定key的array,类似apiSelect的二次封装hook能够用到
    let getDictArrayByKey = (type) => {
        console.log("type:", type);
        return res.data[type].multiValue;
    };
    // f2:返回的是值和key的映射，使用方式类似于 xx["cntovalue"][] ,类似于table或者是modal的update的时候做转化可用
    const getDictMagicNumberByKey = (type) => {
        let workType = res.data[type].multiValue;
        let workObj = {};
        workObj["CnToValue"] = {};
        workObj["ValueToCn"] = {};
        workObj["EnToValue"] = {};
        workObj["ValueToEn"] = {};
        for (let i in workType) {
            workObj["CnToValue"][workType[i].valueName] = workType[i].value;
            workObj["ValueToCn"][workType[i].value] = workType[i].valueName;
            workObj["EnToValue"][workType[i].valueNameEn] = workType[i].value;
            workObj["ValueToEn"][workType[i].value] = workType[i].valueNameEn;
        }
        return JSON.parse(JSON.stringify(workObj));
    };
    // 这个少用
    const getDictData = () => {
        return res;
    };
    return {
        getDictData,
        getDictArrayByKey,
        getDictMagicNumberByKey,
    };
};
