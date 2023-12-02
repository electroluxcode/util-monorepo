let {Handle} = require("../../commonjs_build/middleware/Handle/Handle.js")
// 初始数据
let data = [{id:1,children:{id:14}},{id:2,children:{id:19}},{id:1,children:{id:3}}]

function compare(a,b){
    return JSON.stringify(a)==JSON.stringify(b)
}

describe('Handle', () => {

    // f1:排序
    test('sort/mult', () => {
        let SortFn = (a,b)=>{
            return a.children.id - b.children.id
        }
        let instance2 = new Handle(data).sortBy({key:SortFn}).execute()
        let expectData =  [{"id":1,"children":{"id":3}},{"id":1,"children":{"id":14}},{"id":2,"children":{"id":19}}]
        let flag = compare(instance2,expectData)
        expect(flag).toBe(true);
    });
    
    // f2:筛选
    test('fliter/*', () => {
        let fliterUtil =(item) => {
            return item.id>1;
        }
        let fliterInstance = new Handle(data).where({key:fliterUtil}).execute()
        let expectData =  [{"id":2,"children":{"id":19}}]
        let flag = JSON.stringify(fliterInstance)  == JSON.stringify(expectData)
        expect(flag).toBe(true);
    });

    // f3:分组
    test('groupBy/*', () => {
        let HandleFn = (data)=>{
            return data.children.id
        }
        let groupByInstance = new Handle(data).groupBy({key:HandleFn}).execute()
        let expectData ={ "3": [ { "id": 1, "children": { "id": 3 } } ], "14": [ { "id": 1, "children": { "id": 14 } } ], "19": [ { "id": 2, "children": { "id": 19 } } ] }
        let flag = compare(groupByInstance,expectData)
        expect(flag).toBe(true);
    });  
    
    // f4 属性转化
    test('transform/*', () => {
        const transformByFn =(data)=>{
            data["a"] = data["children"]["id"]
            return data
        }
        let transformInstance = new Handle(data).transformBy({key:transformByFn}).execute()
        let expectData =[ { "id": 1, "children": { "id": 14 }, "a": 14 }, { "id": 2, "children": { "id": 19 }, "a": 19 }, { "id": 1, "children": { "id": 3 }, "a": 3 } ]
        let flag = compare(transformInstance,expectData)
        expect(flag).toBe(true);
    });  
})
  