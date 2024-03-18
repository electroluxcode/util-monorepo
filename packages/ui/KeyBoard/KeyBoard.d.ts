interface KeyBoardParam {
    keys: string[];
    execute: Function;
}
declare class KeyBoard {
    private combinationKeyList;
    private keyQueue;
    private readonly mouseMap;
    /**
     * @des 初始化监听
     * @param keys
     * @returns
     */
    constructor(keys: KeyBoardParam[]);
    /**
     * @des 组合时候的删除
     * @param code
     */
    private deleteKeyFromKeyQueue;
    /**
     * @des 执行 | 检验 键鼠组合
     * @param e
     */
    private KeyMouseExecute;
    private KeyBoardDownFn;
    private MouseDownFn;
    destroy(): void;
}
export declare enum KeyCodes {
    TAB = "tab",
    ENTER = "enter",
    CTRL = "control",
    SHIFT = "shift",
    ALT = "alt",
    ESC = "escape",
    CAPS_LOCK = "capsLock",
    META = "Meta",
    SPACE = " ",
    ARROW_UP = "arrowup",
    ARROW_DOWN = "arrowdown",
    ARROW_LEFT = "arrowleft",
    ARROW_RIGHT = "arrowright",
    BACKSPACE = "backspace",
    F1 = "f1",
    F2 = "f2",
    F3 = "f3",
    F4 = "f4",
    F5 = "f5",
    F6 = "f6",
    F7 = "f7",
    F8 = "f8",
    F9 = "f9",
    F10 = "f10",
    F11 = "f11",
    F12 = "f12",
    Insert = "insert"
}
export { KeyBoard };
