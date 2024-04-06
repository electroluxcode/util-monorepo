"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditHistory = void 0;
class EditNode {
    data;
    prev;
    next;
    constructor(data) {
        this.data = data; // 编辑器的当前操作数据
        this.prev = null; // 指向前一个操作数据的引用
        this.next = null; // 指向后一个操作数据的引用
    }
}
class EditHistory {
    current;
    head; // 链表头部节点
    tail; // 链表尾部节点
    length = 0; // 链表长度
    constructor() {
        this.current = null; // 当前编辑器的操作数据节点
        this.head = null; // 链表头部节点
        this.tail = null; // 链表尾部节点
        this.length = 0; // 链表长度
    }
    // 添加操作记录
    add(data) {
        const newNode = new EditNode(data);
        if (this.head === null) {
            this.head = this.tail = newNode;
        }
        else {
            this.tail.next = newNode;
            newNode.prev = this.tail;
            this.tail = newNode;
        }
        if (this.current === null) {
            this.current = newNode;
        }
        else {
            newNode.prev = this.current;
            this.current.next = newNode;
            this.current = newNode;
        }
        this.length++;
    }
    // 撤销操作
    undo() {
        if (this.current !== null && this.current.prev !== null) {
            this.current = this.current.prev;
            return this.current.data;
        }
        return null;
    }
    // 恢复操作
    redo() {
        if (this.current !== null && this.current.next !== null) {
            this.current = this.current.next;
            return this.current.data;
        }
        return null;
    }
    // 新增方法：移动到指定索引的状态
    moveToState(index) {
        let temp = this.head;
        let i = 0;
        while (temp !== null) {
            if (i === index) {
                this.current = temp;
                return temp.data;
            }
            temp = temp.next;
            i++;
        }
        return null;
    }
}
exports.EditHistory = EditHistory;
