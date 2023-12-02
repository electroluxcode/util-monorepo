
///<reference path = "Handle.d.ts" />
class Handle {
    operations: Array<operationItemType>;
    data: Array<object>;
    constructor(data: Array<object>) {
        this.data = data;
        this.operations = [];
    }
    private getProperty(obj: object, path: string) {
        let temp:any = obj
        path.split('.').forEach((element,curr) => {
            temp[element] ?temp = temp[element] : undefined;
        })
        return temp
    }
    private setProperty(obj: object, path: string,value:any) {
        let temp = obj;
        let pathArr = path.split('.')
        pathArr.forEach((element, curr) => {
            if(curr==pathArr.length-1){
                temp[element] = value;
            }else{
                temp[element] ?? (temp[element] = {})   ;
                temp = temp[element]
            } 
        });
    }
    /**
     * @des feature1:数据筛选
     * @param key_function 
     * @returns this
     */
    where(data: whereType["data"]) {
        this.operations.push({
            type: 'where',
            data: {
                key: data.key,
            }
        });
        return this;
    }

    /**
     * @des feature2:数据排序
     * @param data 
     * @returns this
     */
    sortBy(data: sortByType["data"]) {
        this.operations.push({
            type: 'sort',
            data: {
                key: data.key,
            }
        });
        return this;
    }

    /**
     * @des feature3:数据分组
     */
    groupBy(data: groupByType["data"]) {
        this.operations.push({
            type: 'group',
            data: {
                key: data.key,
            }
        });
        return this;
    }
    /**
     * @des feature4:类名转化
     */
    transformBy(data: transformByType["data"]) {
        this.operations.push({
            type: 'transform',
            data: {
                key: data.key
            }
        });
        return this;
    }


    

    /**
     * @des 这里考虑到 多种分组方式，传入函数
     * @param operation.data.key function
     */
    #groupByFn(operation: any, data: any): any {
        const groups: Record<any, any> = {};
        data.forEach((item: any) => {
            const groupKey = operation.data.key(item);
            if (!groups[groupKey]) {
                groups[groupKey] = [];
            }
            groups[groupKey].push(item);
        });
        return groups
    }
    /**
     * @des 这里考虑到 多种分组方式，传入函数
     * @param operation.data.key function
     */
    #sortByFn(operation: sortByType, data: any) {
        data = data.sort(operation.data.key);
        return data
    }
   
    #transform(operation: transformByType, data: any) {
        let res = data.map((value: any) => {
            value = operation.data.key(value)
            return value
        })
        return res
    }
    /**
     * @des 数据执行
     * @returns 
     */
    execute(): any {
        let result = [...this.data];
        this.operations.forEach((operation: operationItemType) => {
            if (operation.type === 'where') {
                result = result.filter(operation.data.key);
            }
            if (operation.type === 'sort') {
                result = this.#sortByFn(operation, result)
            }
            if (operation.type === 'group') {
                result = this.#groupByFn(operation, result)
            }
            if (operation.type === 'transform') {
                result = this.#transform(operation, result)
            }
        });

        return result;
    }
}

//
export  { Handle };



