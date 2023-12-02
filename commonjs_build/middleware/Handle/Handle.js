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
    /**
     * @des feature1:数据筛选
     * @param key_function
     * @returns this
     */
    where(data) {
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
    sortBy(data) {
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
                key: data.key
            }
        });
        return this;
    }
    /**
     * @des 这里考虑到 多种分组方式，传入函数
     * @param operation.data.key function
     */
    #groupByFn(operation, data) {
        const groups = {};
        data.forEach((item) => {
            const groupKey = operation.data.key(item);
            if (!groups[groupKey]) {
                groups[groupKey] = [];
            }
            groups[groupKey].push(item);
        });
        return groups;
    }
    /**
     * @des 这里考虑到 多种分组方式，传入函数
     * @param operation.data.key function
     */
    #sortByFn(operation, data) {
        data = data.sort(operation.data.key);
        return data;
    }
    #transform(operation, data) {
        let res = data.map((value) => {
            value = operation.data.key(value);
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
                result = result.filter(operation.data.key);
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
