function immer(baseState, thunk) {
    // 将baseState对象映射到代理对象的Map|用来触发
    const proxies = new Map();
    // 将baseState对象映射到其副本的Map.修改操作在上面完成
    const copies = new Map();
    function createProxy(base) {
        // step1.1 判断是否是 object 或者是 array。不是的话不用代理
        if (isPlainObject(base) || Array.isArray(base)) {
            // step1.2 避免重复包装
            if (proxies.has(base))
                return proxies.get(base);
            // step1.3 进入主逻辑
            const proxy = new Proxy(base, handler);
            proxies.set(base, proxy);
            return proxy;
        }
        return base;
    }
    // step2:对象代理
    const handler = {
        // step2.1 获取属性值时的处理 | 递归一次创造代理
        get(target, prop) {
            // 注意:有拷贝直接从copys对象中去拿取属性否则返回原始状态(就是为了初次进入) 
            // 注意:对象才会被代理 重要
            let res = getCurrentSource(target);
            return createProxy(res[prop]);
        },
        // step2.2 设置属性值时的处理 | 递归一次使用代理
        set(target, prop, value) {
            // console.log("set/target, prop, value:",target, prop, value)
            if (target[prop] === value) {
                return true;
            }
            // 值有变化，则进行拷贝再赋值
            // target 是 key 也是 value 所以不用担心重复
            const copy = getOrCreateCopy(target);
            copy[prop] = value; // 给copys对象设置值
            return true;
        },
        // 删除属性时的处理
        deleteProperty(target, property) {
            const copy = getOrCreateCopy(target);
            delete copy[property];
            return true;
        },
        // 检查对象是否包含某个属性
        has(target, prop) {
            return prop in getCurrentSource(target);
        },
        // 获取对象自身的属性列表
        ownKeys(target) {
            return Reflect.ownKeys(getCurrentSource(target));
        },
    };
    // 如果对象没有copy，则创建一个
    function getOrCreateCopy(base) {
        let copy = copies.get(base);
        if (!copy) {
            // 如果是数组，则使用slice创建副本；如果是普通对象，则使用Object.assign创建副本
            copy = Array.isArray(base) ? base.slice() : Object.assign({}, base);
            copies.set(base, copy);
        }
        return copy;
    }
    // 获取状态的当前来源，如果有副本，则返回副本，否则返回原始状态
    function getCurrentSource(base) {
        const copy = copies.get(base);
        return copy || base;
    }
    // 检查给定的基本对象是否已修改
    function hasChanges(base) {
        const proxy = proxies.get(base);
        if (!proxy)
            return false; // 没有创造过这个对象
        if (copies.has(base))
            return true; // 创建了副本，所以有修改
        // 深层检查
        const keys = Object.keys(base);
        for (let i = 0; i < keys.length; i++) {
            const value = base[keys[i]];
            if ((Array.isArray(value) || isPlainObject(value)) && hasChanges(value))
                return true;
        }
        return false;
    }
    // step3.1 如果修改了则返回修改后的克隆
    function finalize(base) {
        if (isPlainObject(base))
            return finalizeObject(base);
        if (Array.isArray(base))
            return finalizeArray(base);
        // 基本数据类型
        return base;
    }
    // step 3.2 处理最终的普通对象 如果未修改则返回它
    function finalizeObject(thing) {
        if (!hasChanges(thing))
            return thing;
        const copy = getOrCreateCopy(thing);
        // 递归处理对象的每个属性 并且进行组装。利用的是浅拷贝
        // console.log("object:",copy)
        Object.keys(copy).forEach(prop => {
            copy[prop] = finalize(copy[prop]);
        });
        return copy;
    }
    // 处理最终的数组 如果未修改则返回它
    function finalizeArray(thing) {
        if (!hasChanges(thing))
            return thing;
        const copy = getOrCreateCopy(thing);
        // 递归处理数组的每个元素。利用的是浅拷贝
        // console.log("array:",copy)
        copy.forEach((value, index) => {
            copy[index] = finalize(copy[index]);
        });
        return copy;
    }
    // 检查对象是否为普通对象
    function isPlainObject(value) {
        if (Object.prototype.toString.call(value) == "[object Object]") {
            return true;
        }
        else {
            return false;
        }
    }
    // step1:创建根代理对象
    const rootClone = createProxy(baseState);
    // step2:执行用户输入
    thunk(rootClone);
    // step3:完成修改后，返回最终状态
    return finalize(baseState);
}
const initialState = {
    todos: [
        { id: 1, text: 'Learn JavaScript', completed: false },
        { id: 2, text: 'Write code', completed: true },
    ],
    user: {
        todos: [
            { id: 1, text: 'Learn JavaScript', completed: false },
            { id: 2, text: 'Write code', completed: true },
        ],
        user: 9999999
    },
};
// 使用immer函数修改状态
const newState = immer(initialState, (draft) => {
    // 在这个函数中，您可以像直接修改原始对象一样修改代理对象（draft）
    draft.todos.push({ id: 3, text: 'Do some tasks', completed: false });
    draft.user.age = 26;
    draft.user.user = 11111111;
});
// 打印修改后的状态
console.log('原始状态：', initialState);
console.log('修改后的状态：', newState);
