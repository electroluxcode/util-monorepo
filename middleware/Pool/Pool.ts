type OrderResult = 'chainNext' | any;

type OrderHandler = (...args: any[]) => OrderResult;
type emitNameType = 'finish' | 'error';
type ChainDataType = {
  eventBus?:{
    finish:Array<Function>
    error:Array<Function>
  }
  [key:string]:any
}
/**
 * @des 链式调用数据
 */
class Chain {
  private fn: OrderHandler;
  private nodeNext: Chain | null;
  // 一般会被当作初始数据
  ChainData: ChainDataType;
  constructor(fn: OrderHandler) {
    this.fn = fn;
    this.ChainData = {};
    this.nodeNext = null;
  }

  /**
   * @des 触发某一个事件
   * @param name
   * @param data 给function的值
   */
  emit = (name: emitNameType, data: any) => {
    if(this.ChainData.eventBus){
      if (this.ChainData.eventBus[name]) {
        this.ChainData.eventBus[name].forEach((element: Function) => {
          element(data);
        });
      } else {
        throw new Error('没有这个事件');
      }
    }
  };

  /**
   * @des 初始化数据
   * @param data
   */
  dataSet(data: ChainDataType): void {
    this.ChainData = data;
  }
  /**
   * @des 异步进入下一个链条
   * @param args
   * @returns
   */
  asyncNext(): OrderResult {
    if (this.nodeNext) {
      this.nodeNext.dataSet(this.ChainData);
      return this.nodeNext.passRequest();
    }
    return this.fn();
  }

  nodeSet(nodeNext: Chain): void {
    this.nodeNext = nodeNext;
  }

  passRequest(): OrderResult {
    // 执行这个方法
    const res = this.fn();
    if (res === 'chainNext') {
      if (this.nodeNext) {
        // 所有的函数都要用 chain 方法包起来，否则没有 this.nodeNext
        this.nodeNext.dataSet(this.ChainData);
        return this.nodeNext.passRequest();
      }
    }
    if (this.nodeNext) {
      this.nodeNext.dataSet(this.ChainData);
    }

    return res;
  }
}




export interface ExtendedChainData extends Chain{
  ChainData:{
    init:{
      xml_id:number,
      model_id:number
    }
    res:any
  }
}

/**
 * @des 初始化数据
 * @param this 
 * @returns 
 */
function initPost(this:ExtendedChainData) {
  console.log('数据校验:');
  if(!this.ChainData.init){
    this.emit("error","使用者触发error事件")
    return
  }
  return 'chainNext';
}


// 请你理解这个程序设计方法并且 为小白用md写一篇教程。要注意md的美观和易懂。要把使用它的优点和注意点和边界点都指出来
export { Chain };
