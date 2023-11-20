interface Basic {
    value: any;
    fre: number;
    key: any
}
class Lfu {
    Size: number;
    Cache: Map<any, Basic>;
    constructor(size:number){
        this.Cache =new Map()
        this.Size = size
    }
    get(key:any) {
        if (this.Cache.has(key)) {
            let temp = this.Cache.get(key)
            temp.fre++;
            // 漏这里
            this.Cache.delete(temp.key);
            this.Cache.set(key, temp)
            return temp.value
        } else {
            return -1
        }
    }
    /**
     * @des 最简单的可以筛选出最小的 值 然后进行比较
     * @param key 
     * @param value 
     * @returns 
     */
    put(key:any, value:any) {
        if (this.Cache.has(key)) {
            let temp = this.Cache.get(key)
            temp.fre++;
            temp.value = value
            this.Cache.set(key, temp)
            return
        } else if (this.Cache.size == this.Size) {
            let min = Infinity;
            for (let i of this.Cache.values()) {
                min = Math.min(i.fre, min)
            }
            for (const [k, v] of this.Cache.entries()) {
                if (min == v.fre) {
                    // 漏这里
                    this.Cache.delete(k);
                    break;
                }
            }
            
        }
        this.Cache.set(key,{value,key,fre:0})
    }
}

export {
    Lfu
}