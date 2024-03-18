type operationItemType =sortByType | whereType | groupByType | transformByType

interface sortByType  {
    type : "sort",
    data:{
        key:any,
    }
}
interface whereType  {
    type : "where",
    data:{
        key: (value: any) => boolean,
    }
}
interface groupByType  {
    type : "group",
    data:{
        key:any
    }
}
interface transformByType  {
    type : "transform",
    data:{
       key:<t>(arg:t)=>t
    }
}
