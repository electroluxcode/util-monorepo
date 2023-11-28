type operationItemType =sortByType | whereType | groupByType | transformBy

interface sortByType  {
    type : "sort",
    data:{
        key:any,
        method:"asc" | "desc"
    }
}
interface whereType  {
    type : "where",
    data:{
        callback: (value: any) => boolean,
    }
}
interface groupByType  {
    type : "group",
    data:{
        key:string | Record<any,any>
    }
}
interface transformByType  {
    type : "transform",
    data:{
       key:{
        originKey:string | Array<string>,
        targetKey:string | Array<string>,
       }
    }
}
