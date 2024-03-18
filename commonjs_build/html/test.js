// const parentTree = [
// 	{
// 		id: 1,
// 		parent: null,
// 		name: "xiaoming",
// 	},
// 	{
// 		id: 2,
// 		parent: 1,
// 		name: "小红",
// 	},
// 	{
// 		id: 3,
// 		parent: 1,
// 		name: "小红",
// 	},{
// 		id: 3,
// 		parent: 0,
// 		name: "小红",
// 	},
// ];
// const arrtotree = (arr)=>{
//     let tree = []
//     arr.forEach((e)=>{
//         e.child = arr.filter((v)=>{
//             return e.id == v.parent
//         })
//         if(!e.parent){
//             tree.push(e)
//         }
//     })
//     return tree
// }
// arrtotree(parentTree)
// let tree = [
//     {
//         "id": 1,
//         "parent": null,
//         "name": "xiaoming",
//         "child": [
//             {
//                 "id": 2,
//                 "parent": 1,
//                 "name": "小红",
//                 "child": []
//             },
//             {
//                 "id": 3,
//                 "parent": 1,
//                 "name": "小红",
//                 "child": []
//             }
//         ]
//     },
//     {
//         "id": 4,
//         "parent": 0,
//         "name": "小红",
//         "child":[]
//     }
// ]
// const treetoarr = (tree)=>{
//     let arr = []
//     for(let i =0;i<tree.length;i++){
//         let base = tree[i]
//         if(Array.isArray(base.child) && base.child.length){
//             arr.push(...treetoarr(base.child))
//         }
//         arr.push(tree[i])
//     }
//     return arr
// }
// treetoarr(tree)
