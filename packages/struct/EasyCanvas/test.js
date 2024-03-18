/**
 *  题目描述:给你单链表的头指针 head 和两个整数 left 和 right ，其中 left <= right 。请你反转从位置 left 到位置 right 的链表节点，返回 反转后的链表 
    输入：head = [1,2,3,4,5], left = 2, right = 4
    输出：[1,4,3,2,5]
 */
let projectId = {
    id:1,
    obj:{
        id:3,
        obj:{
            name:45
        }
    }
}
let handler = {
    get(target, prop) {
        // 注意:有拷贝直接从copys对象中去拿取属性否则返回原始状态(就是为了初次进入) 
        // 注意:对象才会被代理 重要
        // if (prop in target) {   
        //     return target[key]
        // }
        // console.log("触发了get")
        return target[prop]
    },
    // step2.2 设置属性值时的处理 | 递归一次使用代理
    set(target, prop, value) {
        target[prop] = value;
        console.log("触发了set")
        return true;
    },
}
let te = new Proxy(projectId,handler)

// te.id = 5
te.obj.id = 5