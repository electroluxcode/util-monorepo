// ---工具方法---
const proxies = new Map()
const copies = new Map()

function getCurrentSource(base) {
	const copy = copies.get(base)
	return copy || base
}
function createProxy(base) {
	// step1.1 判断是否是 object 或者是 array。不是的话不用代理
	if (typeof base == "object") {
		// step1.2 避免重复包装
		if (proxies.has(base)) return proxies.get(base)
		// step1.3 进入主逻辑
		const proxy = new Proxy(base, handler)
		proxies.set(base, proxy)
		return proxy
	}
	return base
}

const handler = {
    // step2.1 获取属性值时的处理 | 递归一次创造代理
    get(target, prop) {
        // 注意:有拷贝直接从copys对象中去拿取属性否则返回原始状态(就是为了初次进入) 
        // 注意:对象才会被代理 重要
        let res = getCurrentSource(target)
        console.log("get:",{target, prop})
        return createProxy(res[prop])
    },
    // step2.2 设置属性值时的处理 | 递归一次使用代理
    set(target, prop, value) {
        console.log("set:",{target,prop,value})
        // console.log("set/target, prop, value:",target, prop, value)
        if (target[prop] === value) {
            return true;
        }
        // 值有变化，则进行拷贝再赋值
        // target 是 key 也是 value 所以不用担心重复
        
        const copy = getOrCreateCopy(target);
        copy[prop] = value; // 给copys对象设置值
        // return true;
        return Reflect.set(target,prop,value);
    },
    // 删除属性时的处理
    deleteProperty(target, property) {
        const copy = getOrCreateCopy(target)
        delete copy[property]
        return true
    },
   

}

function getOrCreateCopy(base) {
    let copy = copies.get(base)
    if (!copy) {
        // 如果是数组，则使用slice创建副本；如果是普通对象，则使用Object.assign创建副本
        copy = Array.isArray(base) ? base.slice() : Object.assign({}, base)
        copies.set(base, copy)
    }
    return copy
}
const ObjectTest = {
	id: 5,
	a: {
		id: 3,
        obj:{
            id:5
        }
	},
};
let test4 = new Proxy(ObjectTest, handler);

test4.a.obj.id = 45