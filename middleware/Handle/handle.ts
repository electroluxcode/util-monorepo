
interface operationItemType {
    type: "where" | "sortBy" | "groupBy" | "transformBy",

    data: {
        callback: (value: any) => boolean,
        key: any,
        method: "asc" | "desc",
    }
}
class Query {
    operations: Record<'key' | 'type' | 'method' | any, any>;
    data: Array<object>;
    constructor(data: Array<object>) {
        this.data = data;
        this.operations = [];
       
    }

    /**
     * @des feature1:数据筛选
     * @param callback_function 
     * @returns this
     */
    where(data: Record<'callback', any>) {
        this.operations.push({
            type: 'where',
            data: {
                callback: data.callback,
            }

        });
        return this;
    }

    /**
     * @des feature2:数据排序
     * @param data 
     * @returns this
     */
    sortBy(data: { key: any, method: "asc" | "desc" }) {
        this.operations.push({
            type: 'sortBy',
            data: {
                key: data.key,
                method: data.method,
            }

        });
        return this;
    }

    /**
     * @des feature3:数据分组
     * @param data 
     * @returns 
     */
    groupBy(data: { key: string }) {
        this.operations.push({
            type: 'groupBy',
            data: {
                key: data.key,
            }
        });
        return this;
    }
    transformBy(data: { originKey: Array<string>, targetKey: Array<string> }) {
        this.operations.push({
            type: 'transformBy',
            data: {
                key: data
            }
        });
        return this;
    }

    /**
     * @des 分类工具方法
     * @param operation 
     * @param data 
     * @returns 
     */
    #groupByFn(operation: any, data: any): any {
        const groups: Record<any, any> = {};
        data.forEach((item: any) => {
            const groupKey = item[operation.data.key];
            if (!groups[groupKey]) {
                groups[groupKey] = [];
            }
            groups[groupKey].push(item);
        });
        data = Object.values(groups);
        return data
    }
    /**
    * @des 排序工具方法
    * @param operation 
    * @param data 
    * @returns 
    */
    #sortByFn(operation: any, data: any) {
        if (operation.data.method === 'asc') {
            data = data.sort((a: any, b: any) => {
                return Number(a[operation.data.key]) - Number(b[operation.data.key]);
            });
        } else {
            data = data.sort((a: any, b: any) => {
                return Number(b[operation.data.key]) - Number(a[operation.data.key]);
            });
        }
        return data
    }
    /**
     * @des 数据执行
     * @returns 
     */
    execute():any {
        let result = [...this.data];
        this.operations.forEach((operation: operationItemType) => {
            if (operation.type === 'where') {
                result = result.filter(operation.data.callback);
            }
            if (operation.type === 'sortBy') {
                result = this.#sortByFn(operation, result)
            }
            if (operation.type === 'groupBy') {
                result = this.#groupByFn(operation, result)
            }

            // 数据key 转化
            if (operation.type === 'transformBy') {
                let origin = operation.data.key.originKey
                let target = operation.data.key.targetKey
                let cureArr: any = []
                let res = result.map((value: any) => {
                    let cureItemArr: Record<any, any> = {}
                    for (let i = 0; i < origin.length; i++) {
                        // target[i] 是 key 
                        value[target[i]] = value[origin[i]]
                        cureItemArr[target[i]] = value[origin[i]]
                    }
                    cureArr.push(cureItemArr)
                    return value
                })
                result = res
            }

        });

        return {
            result: result,
        };
    }
}

// 排序示例
// let data = [{id:1,name:"第一个数据"},{id:2,name:"第二个数据"},{id:1,children:{id:3}}]
// let instance1 = new Query(data).sortBy({key:"id",method:"desc"}).execute()
// console.log(instance1)


// // 筛选示例
// let fliterUtil =(item:any) => {
//     return item.id>1;
// }
// let instance2 = new Query(data).where({callback:fliterUtil}).execute()
// console.log(instance2)

// // 分组示例
// let instance3 = new Query(data).groupBy({key:"id"}).execute()
// console.log(instance3)


// // 属性转化示例
// let instance4 = new Query(data).transformBy({originKey:["id","name"],targetKey:["test","mt"]}).execute()
// console.log(JSON.stringify(instance4,null,2))



// let data = [{
//     "type": "Feature",
//     "geometry": {
//         "type": "Point",
//         "coordinates": [
//             9.921309617,
//             57.0517658,
//             79.99999999999999
//         ]
//     },
//     "properties": {
//         "name": "Aalborg, Denmark",
//         "styleUrl": "#defaultballoon",
//         "styleHash": "-7ed08019",
//         "description": "<table width='320'><tr><td align='middle'>< img src='http://www.cleancruising.com.au/images/ports/DKAAL.jpg' height='240' width='320' border='0'></td></tr><tr><td>Aalborg is located in the north of Jutland. The local tourist board calls it the \"little Paris of the North\". Although this may seem a bit far fetched, the location by the Limfjord is truly superb, and the town is well worth a visit. From Aalborg, it is not far to the white beaches of the North Sea, to the forest of Rold, the lovely Rebild Hills or the slopes of the Jutlandic Ridge.<br></td></tr><tr><td><br><br></tr></td></table>"
//     }
// }]
// let instance4 = new Query(data).transformBy(
//     {originKey:["properties.name","properties.name"],targetKey:["test","mt"]}).execute()
export { Query }