interface KeyBoardParam {
    keys: string[],
    // 按键触发后要执行的函数
    execute: Function,
}

class KeyBoard {
    private combinationKeyList: any[];
    private keyQueue: any[];
    private readonly mouseMap: string[];
    
    /**
     * @des 初始化监听
     * @param keys 
     * @returns 
     */
    constructor(keys: KeyBoardParam[]) {
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
    private deleteKeyFromKeyQueue(code: any) {
      this.keyQueue = Array.from(new Set(this.keyQueue));
      let deleteIndex = this.keyQueue.indexOf(code);
      this.keyQueue.splice(deleteIndex, 1);
    }
    /**
     * @des 执行 | 检验 键鼠组合
     * @param e 
     */
    private KeyMouseExecute(e: any) {
        // console.log(e)
      let code = e.key ?? e.keyCode;
      const _keyQueue = JSON.stringify(this.keyQueue);
      const index = this.combinationKeyList.findIndex((item) => JSON.stringify(item.keys) === _keyQueue);
        console.log(_keyQueue,"_keyQueue")
      if (index > -1) {
        this.combinationKeyList[index].execute();
      } else {
        this.keyQueue = [];
      }
      this.deleteKeyFromKeyQueue(code);
    }
  
    private KeyBoardDownFn(e: any) {
        
      let code = e.key ?? e.keyCode;
      if (typeof code === 'number') {
        this.keyQueue.push(code);
      } else {
        this.keyQueue.push(code.toLowerCase());
      }
    //   e.preventDefault()
    }
  
    private MouseDownFn(e: any) {
      this.keyQueue.push(this.mouseMap[e.button]);
    }
  
    public destroy() {
      window.removeEventListener('keydown', this.KeyBoardDownFn);
      window.removeEventListener('keyup', this.KeyMouseExecute);
      window.removeEventListener('mousedown', this.MouseDownFn);
      window.removeEventListener('mouseup', this.KeyMouseExecute);
    }
  }
  
  // 定义键盘事件常量 | 注意
  export enum KeyCodes {
    TAB = 'tab',
    ENTER = 'enter',
    CTRL = 'control',
    SHIFT = 'shift',
    ALT = 'alt',
    ESC = 'escape',
    CAPS_LOCK = 'capsLock',
    META = 'Meta',
    SPACE = ' ',
    ARROW_UP = 'arrowup',
    ARROW_DOWN = 'arrowdown',
    ARROW_LEFT = 'arrowleft',
    ARROW_RIGHT = 'arrowright',
    BACKSPACE = 'backspace',
    F1 = 'f1',
    F2 = 'f2',
    F3 = 'f3',
    F4 = 'f4',
    F5 = 'f5',
    F6 = 'f6',
    F7 = 'f7',
    F8 = 'f8',
    F9 = 'f9',
    F10 = 'f10',
    F11 = 'f11',
    F12 = 'f12',
    Insert = 'insert',
  }
  

  export { KeyBoard };


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
  