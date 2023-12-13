// step2:mock 请求
const data = {
    data: {
        workType: [
            {
                id: 55,
                dictType: 4,
                dictName: '工种',
                dictNameEn: 'workType',
                valueName: '木工',
                valueNameEn: 'Carpentry',
                value: '00',
                isEnable: '1',
            },
            {
                id: 56,
                dictType: 4,
                dictName: '工种',
                dictNameEn: 'workType',
                valueName: '钢筋工',
                valueNameEn: 'Reinforcing Steel Worker',
                value: '01',
                isEnable: '1',
            },
        ],
    },
};
const mockData = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(data);
        }, 1000);
    });
};
const apiData = await mockData();
console.log(apiData);
const DataDictTest = {
    workType: apiData.data.workType,
};
// step3 拼装数据
function KeyApiDataSwitch(DataDictTest) {
    const BaseKey = Object.keys(DataDictTest);
    BaseKey.map((e) => {
        const nowKey = {};
        const arr = DataDictTest[e];
        if (!arr) {
            throw new Error('zptest:数据字典key与后端不统一,请检查:' + e);
        }
        DataDictTest[`${e}Enhance`] = {};
        DataDictTest[`${e}Enhance`]["ValueToCn"] = {};
        DataDictTest[`${e}Enhance`]["ValueToEnglish"] = {};
        DataDictTest[`${e}Enhance`]["CnToValue"] = {};
        DataDictTest[`${e}Enhance`]["CnToEnglish"] = {};
        DataDictTest[`${e}Enhance`]["EnglishToValue"] = {};
        DataDictTest[`${e}Enhance`]["EnglishToCn"] = {};
        // 基本格式:workType:{00: 'Carpentry', 01: 'Reinforcing Steel Worker'}
        for (let i = 0; i < arr.length; i++) {
            nowKey[arr[i].value] = arr[i].valueNameEn;
            DataDictTest[`${e}Enhance`]["ValueToCn"][arr[i].value] = arr[i].valueName;
            DataDictTest[`${e}Enhance`]["ValueToEnglish"][arr[i].value] = arr[i].valueNameEn;
            DataDictTest[`${e}Enhance`]["CnToValue"][arr[i].valueName] = arr[i].value;
            DataDictTest[`${e}Enhance`]["CnToEnglish"][arr[i].valueName] = arr[i].dictNameEn;
            DataDictTest[`${e}Enhance`]["EnglishToValue"][arr[i].valueNameEn] = arr[i].value;
            DataDictTest[`${e}Enhance`]["EnglishToCn"][arr[i].valueNameEn] = arr[i].valueName;
        }
        DataDictTest[e] = nowKey;
    });
    console.log('赋值完成:', DataDictTest);
    return DataDictTest;
}
let result = KeyApiDataSwitch(DataDictTest);
console.log(result);
export { KeyApiDataSwitch };
