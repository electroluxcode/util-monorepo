let data = {
    msg: "操作成功",
    code: 200,
    data: {
        envEquipType: {
            dictName: "环境设备细分",
            multiValue: [
                {
                    id: "306",
                    dictType: 26,
                    projectId: "5d8b1afc-ceb5-4b07-9d04-1269984e7697",
                    dictName: "环境设备细分",
                    dictNameEn: "envEquipType",
                    valueName: "7种测量环境牌",
                    valueNameEn: "Seven in one",
                    value: "00",
                    isEnable: "1",
                    canWrite: "1",
                },
                {
                    id: "307",
                    dictType: 26,
                    projectId: "5d8b1afc-ceb5-4b07-9d04-1269984e7697",
                    dictName: "2222",
                    dictNameEn: "envEquipType",
                    valueName: "7种测量环境牌",
                    valueNameEn: "Seven in one",
                    value: "00",
                    isEnable: "1",
                    canWrite: "1",
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
export const useDict = async (cache = true) => {
    let res;
    // 加一层缓存
    try {
        if (cache) {
            res = localStorage.getItem("useDict");
        }
        else {
            res = await dictManagementList();
        }
        if (!res) {
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
        return res.data[type].multiValue;
    };
    // f2:返回的是值和key的映射，使用方式类似于 xx["cntovalue"][] ,类似于table或者是modal的update的时候做转化可用
    const getDictMagicNumberByKey = (type) => {
        let workType = res.data[type].multiValue;
        let workObj = {};
        workObj["CnToValue"] = {};
        workObj["ValueToCn"] = {};
        for (let i in workType) {
            workObj["CnToValue"][workType[i].valueName] = workType[i].value;
            workObj["ValueToCn"][workType[i].value] = workType[i].valueName;
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
