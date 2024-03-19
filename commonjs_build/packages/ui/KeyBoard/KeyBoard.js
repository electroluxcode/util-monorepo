"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyBoard = exports.KeyCodes = void 0;
class KeyBoard {
    combinationKeyList;
    keyQueue;
    mouseMap;
    /**
     * @des 初始化监听
     * @param keys
     * @returns
     */
    constructor(keys) {
        this.combinationKeyList = [];
        this.keyQueue = [];
        this.mouseMap = ["leftMouse", "wheelMouse", "rightMouse"];
        if (!keys) {
            console.warn('needs keys array');
            return;
        }
        this.combinationKeyList = keys;
        this.deleteKeyFromKeyQueue = this.deleteKeyFromKeyQueue.bind(this);
        this.KeyMouseExecute = this.KeyMouseExecute.bind(this);
        this.KeyBoardDownFn = this.KeyBoardDownFn.bind(this);
        this.MouseDownFn = this.MouseDownFn.bind(this);
        this.destroy = this.destroy.bind(this);
        window.addEventListener('keydown', this.KeyBoardDownFn, false);
        window.addEventListener('keyup', this.KeyMouseExecute, false);
        window.addEventListener('mousedown', this.MouseDownFn, false);
        window.addEventListener('mouseup', this.KeyMouseExecute, false);
    }
    /**
     * @des 组合时候的删除
     * @param code
     */
    deleteKeyFromKeyQueue(code) {
        this.keyQueue = Array.from(new Set(this.keyQueue));
        let deleteIndex = this.keyQueue.indexOf(code);
        this.keyQueue.splice(deleteIndex, 1);
    }
    /**
     * @des 执行 | 检验 键鼠组合
     * @param e
     */
    KeyMouseExecute(e) {
        // console.log(e)
        let code = e.key ?? e.keyCode;
        const _keyQueue = JSON.stringify(this.keyQueue);
        const index = this.combinationKeyList.findIndex((item) => JSON.stringify(item.keys) === _keyQueue);
        console.log(_keyQueue, "_keyQueue");
        if (index > -1) {
            this.combinationKeyList[index].execute();
        }
        else {
            this.keyQueue = [];
        }
        this.deleteKeyFromKeyQueue(code);
    }
    KeyBoardDownFn(e) {
        let code = e.key ?? e.keyCode;
        if (typeof code === 'number') {
            this.keyQueue.push(code);
        }
        else {
            this.keyQueue.push(code.toLowerCase());
        }
        //   e.preventDefault()
    }
    MouseDownFn(e) {
        this.keyQueue.push(this.mouseMap[e.button]);
    }
    destroy() {
        window.removeEventListener('keydown', this.KeyBoardDownFn);
        window.removeEventListener('keyup', this.KeyMouseExecute);
        window.removeEventListener('mousedown', this.MouseDownFn);
        window.removeEventListener('mouseup', this.KeyMouseExecute);
    }
}
exports.KeyBoard = KeyBoard;
// 定义键盘事件常量 | 注意
var KeyCodes;
(function (KeyCodes) {
    KeyCodes["TAB"] = "tab";
    KeyCodes["ENTER"] = "enter";
    KeyCodes["CTRL"] = "control";
    KeyCodes["SHIFT"] = "shift";
    KeyCodes["ALT"] = "alt";
    KeyCodes["ESC"] = "escape";
    KeyCodes["CAPS_LOCK"] = "capsLock";
    KeyCodes["META"] = "Meta";
    KeyCodes["SPACE"] = " ";
    KeyCodes["ARROW_UP"] = "arrowup";
    KeyCodes["ARROW_DOWN"] = "arrowdown";
    KeyCodes["ARROW_LEFT"] = "arrowleft";
    KeyCodes["ARROW_RIGHT"] = "arrowright";
    KeyCodes["BACKSPACE"] = "backspace";
    KeyCodes["F1"] = "f1";
    KeyCodes["F2"] = "f2";
    KeyCodes["F3"] = "f3";
    KeyCodes["F4"] = "f4";
    KeyCodes["F5"] = "f5";
    KeyCodes["F6"] = "f6";
    KeyCodes["F7"] = "f7";
    KeyCodes["F8"] = "f8";
    KeyCodes["F9"] = "f9";
    KeyCodes["F10"] = "f10";
    KeyCodes["F11"] = "f11";
    KeyCodes["F12"] = "f12";
    KeyCodes["Insert"] = "insert";
})(KeyCodes || (exports.KeyCodes = KeyCodes = {}));
// 使用CombinationKey类
//   const combinationKey = new KeyBoard([
//     {
//         // 要按下的键，数组的顺序是按下的顺序
//         keys: ["arrowleft"],
//         // 按键触发后要执行的函数
//         execute: () => {
//           console.log('f11');
//         },
//       },
//     {
//       // 要按下的键，数组的顺序是按下的顺序
//       keys: [KeyCodes.SPACE],
//       // 按键触发后要执行的函数
//       execute: () => {
//         console.log('SPACE');
//       },
//     },
//     {
//       keys: [KeyCodes.SHIFT, "leftMouse"],
//       execute: () => {
//         console.log('shift + leftMouse');
//       },
//     },
//     {
//       keys: [KeyCodes.CTRL, 'y'],
//       execute: () => {
//         console.log('Ctrl + Y');
//       },
//     },
//   ]);
//   // 销毁事件监听
//   combinationKey.destroy();
