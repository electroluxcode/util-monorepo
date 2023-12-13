type DeepShowType<t> = {
    [key in keyof t]: t[key]
} & {}

type EnhanceType = "ValueToCn" | "ValueToEnglish" | "CnToValue"
    | "CnToEnglish" | "EnglishToValue" | "EnglishToCn"
type GetterAble<t extends string, k extends string> = t extends any
    ? { [v in `${t}${k}`]: DeepShowType<Record<EnhanceType, any>> } | { [v in `${t}`]: any }
    : any;
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends
    (k: infer I) => void
    ? I
    : never;

// step1 : 定义api格式
type DictValueType = {
    remark?: string | number;
    id: string | number;
    dictType: string | number;
    dictName: string | number;
    dictNameEn: string | number;
    valueName: string | number;
    valueNameEn: string | number;
    value: string | number;
    isEnable: string | number;
};
type DictKeyType = "workType" 
type DictType = {
    data: {
        [key in DictKeyType]: Array<DictValueType>;
    };
};


// step2:mock 请求
const data: DictType = {
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
const mockData = (): Promise<DictType> => {
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
function KeyApiDataSwitch<t extends string>(DataDictTest) {
    const BaseKey = Object.keys(DataDictTest);
    BaseKey.map((e) => {
        const nowKey = {};
        const arr = DataDictTest[e];

        if (!arr) {
            throw new Error('zptest:数据字典key与后端不统一,请检查:' + e);
        }
        DataDictTest[`${e}Enhance`] = {}
        DataDictTest[`${e}Enhance`]["ValueToCn"] = {}
        DataDictTest[`${e}Enhance`]["ValueToEnglish"] = {}
        DataDictTest[`${e}Enhance`]["CnToValue"] = {}
        DataDictTest[`${e}Enhance`]["CnToEnglish"] = {}
        DataDictTest[`${e}Enhance`]["EnglishToValue"] = {}
        DataDictTest[`${e}Enhance`]["EnglishToCn"] = {}
        // 基本格式:workType:{00: 'Carpentry', 01: 'Reinforcing Steel Worker'}
        for (let i = 0; i < arr.length; i++) {
            nowKey[arr[i].value] = arr[i].valueNameEn;
            DataDictTest[`${e}Enhance`]["ValueToCn"][arr[i].value] = arr[i].valueName
            DataDictTest[`${e}Enhance`]["ValueToEnglish"][arr[i].value] = arr[i].valueNameEn
            DataDictTest[`${e}Enhance`]["CnToValue"][arr[i].valueName] = arr[i].value
            DataDictTest[`${e}Enhance`]["CnToEnglish"][arr[i].valueName] = arr[i].dictNameEn
            DataDictTest[`${e}Enhance`]["EnglishToValue"][arr[i].valueNameEn] = arr[i].value
            DataDictTest[`${e}Enhance`]["EnglishToCn"][arr[i].valueNameEn] = arr[i].valueName
        }
        DataDictTest[e] = nowKey;
    });
    console.log('赋值完成:', DataDictTest);
    return DataDictTest as UnionToIntersection<GetterAble<t, "Enhance">>
}
let result = KeyApiDataSwitch<DictKeyType>(DataDictTest)
console.log(result)


export { KeyApiDataSwitch }