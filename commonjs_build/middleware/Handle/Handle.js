"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Handle = void 0;
///<reference path = "Handle.d.ts" />
class Handle {
    operations;
    data;
    constructor(data) {
        this.data = data;
        this.operations = [];
    }
    /**
     * @des feature1:数据筛选
     * @param callback_function
     * @returns this
     */
    where(data) {
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
    sortBy(data) {
        this.operations.push({
            type: 'sort',
            data: {
                key: data.key,
                method: data.method,
            }
        });
        return this;
    }
    /**
     * @des feature3:数据分组
     */
    groupBy(data) {
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
    transformBy(data) {
        this.operations.push({
            type: 'transform',
            data: {
                key: data
            }
        });
        return this;
    }
    getProperty(obj, path) {
        let temp = obj;
        path.split('.').forEach((element, curr) => {
            temp[element] ? temp = temp[element] : undefined;
        });
        return temp;
    }
    setProperty(obj, path, value) {
        let temp = obj;
        let pathArr = path.split('.');
        pathArr.forEach((element, curr) => {
            if (curr == pathArr.length - 1) {
                temp[element] = value;
            }
            else {
                temp[element] ?? (temp[element] = {});
                temp = temp[element];
            }
        });
    }
    #groupByFn(operation, data) {
        let that = this;
        const groups = {};
        if (operation.data.key.includes(".")) {
            data.forEach((item) => {
                const groupKey = that.getProperty(item, operation.data.key);
                if (!groups[groupKey]) {
                    groups[groupKey] = [];
                }
                groups[groupKey].push(item);
            });
            data = groups;
        }
        else {
            data.forEach((item) => {
                const groupKey = item[operation.data.key];
                if (!groups[groupKey]) {
                    groups[groupKey] = [];
                }
                groups[groupKey].push(item);
            });
            data = groups;
        }
        return data;
    }
    #sortByFn(operation, data) {
        data = data.sort((a, b) => {
            if (operation.data.key.includes(".")) {
                let value1 = this.getProperty(a, operation.data.key);
                let value2 = this.getProperty(b, operation.data.key);
                if (operation.data.method === 'asc') {
                    return value1 - value2;
                }
                else {
                    return value2 - value1;
                }
            }
            else {
                let value1 = Number(a[operation.data.key]);
                let value2 = Number(b[operation.data.key]);
                if (operation.data.method === 'asc') {
                    return value1 - value2;
                }
                else {
                    return value2 - value1;
                }
            }
        });
        return data;
    }
    #transform(operation, data) {
        let origin = operation.data.key.originKey;
        let target = operation.data.key.targetKey;
        let cureArr = [];
        // 遍历,每一个 object 是 value
        let res = data.map((value) => {
            let cureItemArr = {};
            for (let i = 0; i < origin.length; i++) {
                if (origin[i].includes(".")) {
                    // 两个都命中
                    if (target[i].includes(".")) {
                        this.setProperty(value, target[i], this.getProperty(value, origin[i]));
                    }
                    else {
                        value[target[i]] = this.getProperty(value, origin[i]);
                    }
                }
                else {
                    if (target[i].includes(".")) {
                        console.log("命中");
                        this.setProperty(value, target[i], value[origin[i]]);
                    }
                    else {
                        value[target[i]] = value[origin[i]];
                    }
                }
            }
            cureArr.push(cureItemArr);
            return value;
        });
        return res;
    }
    /**
     * @des 数据执行
     * @returns
     */
    execute() {
        let result = [...this.data];
        this.operations.forEach((operation) => {
            if (operation.type === 'where') {
                result = result.filter(operation.data.callback);
            }
            if (operation.type === 'sort') {
                result = this.#sortByFn(operation, result);
            }
            if (operation.type === 'group') {
                result = this.#groupByFn(operation, result);
            }
            if (operation.type === 'transform') {
                result = this.#transform(operation, result);
            }
        });
        return result;
    }
}
exports.Handle = Handle;
