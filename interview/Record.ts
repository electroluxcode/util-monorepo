// /**
//  * 在线笔试说明：
//  * 1. 本次在线笔试为开卷，在笔试期间笔试者可以使用任意搜索引擎、文档、书籍等查找资料，也可以使用 IDE 进行代码编写并验证后将代码粘贴到指定位置。
//  * 2. 在笔试期间，笔试者必须全程独立完成，不允许通过任意方式求助他人获取帮助。如有发现，后果自负。
//  * 3. 若对笔试题目有疑问，可以随时在笔试页面右下角向面试官提问。
//  * 4. 本次在线笔试共有四题，答题时间共 60 分钟，超时将自动提交，无法继续作答，请合理安排答题时间。
//  */

// /**
//  * 一、
//  * 请实现函数 reverseWord ，对字符串中的单词进行反转，并满足以下条件：
//  * 1. 单词排列反序
//  * 2. 单词间以空格进行分割，若有多个空格只保留一个
//  * 3. 去除字符串所有首尾的所有空格
//  */

//  function reverseWord(input: string): string {
//     // 你的代码实现...
//     const trimmedInput = input.trim();
//     const words = trimmedInput.split(/\s+/);
//     const reversedString = words.reverse().join(' ');
//     return reversedString;
// }
// // 运行示例
// console.log(reverseWord('  hello    the world! ')); // 输出："world! the hello"

//   /**
//    * 二、
//    * 请实现函数 compareVersions ，对两个版本号进行比较，并满足以下条件：
//    * @param  {String}   verA  （必传）需要比较的新版本号
//    * @param  {String}   verB  （必传）用于比较的旧版本号
//    * @param  {String}   type  （可选）比较方案
//    *                                 gt：大于
//    *                                 gte：大于等于
//    *                                 lt：小于
//    *                                 lte：小于等于
//    *                                 eq：等于
//    * @return {String|Boolean}     不传入type时，返回比较值，大于返回1、等于返回0、小于返回-1
//                                   传入type时，返回判断值 bool
//    *
//    */
// function compareVersions(verA, verB, type?:string) {
//     // 你的代码实现...
//     const versionA = verA.split('.').map(Number);
//     const versionB = verB.split('.').map(Number);

//     const maxLength = Math.max(versionA.length, versionB.length);
//     // 补0
//     for (let i = 0; i < maxLength; i++) {
//         const numA = versionA[i] || 0;
//         const numB = versionB[i] || 0;
//         if (numA > numB) {
//             if(type === 'gte' || type === 'gt'){
//                 return true
//             }else{
//                 return 1
//             }
//         }
//         if (numA < numB) {
//             if(type === 'lte' || type === 'lt' ){
//                 return true
//             }else{
//                 return -1
//             }
//         }

//     }
//     return type === 'eq' || type === '' ? 0 : false;
// }

//   // 运行
//   compareVersions('2.0', '1.0.0'); // 1
//   compareVersions('1', '1.0.0'); // 0
//   compareVersions('1.2.3', '2.1.0'); // -1
//   compareVersions('1.2.0', '1.10.0'); // -1

//   compareVersions('1.0.0', '1', 'gte'); // true
//   compareVersions('1.0.0', '1', 'gt'); // false
//   compareVersions('1.0.0', '1', 'eq'); // true

//   /**
//    * 三、
//    * 请写一个数据结构转换函数 convert
//    * 现有商品列表数据 itemList
//    * 将该商品列表按照商品分类（category）进行分组，且分组间按该分类下商品的种数进行倒序排序（休闲零食有四种商品，因此排第一）;
//    * 在每一分组下按商品的销量（saleCount）进行倒序排序。
//    * 要求不能对原数据 itemList 的任意属性值进行修改
//    */
// class Handle {
//     operations: Array<operationItemType>;
//     data: Array<object>;
//     constructor(data: Array<object>) {
//         this.data = data;
//         this.operations = [];
//     }

//     /**
//      * @des feature1:数据筛选
//      * @param key_function
//      * @returns this
//      */
//     where(data: whereType["data"]) {
//         this.operations.push({
//             type: 'where',
//             data: {
//                 key: data.key,
//             }
//         });
//         return this;
//     }

//     /**
//      * @des feature2:数据排序
//      * @param data
//      * @returns this
//      */
//     sortBy(data: sortByType["data"]) {
//         this.operations.push({
//             type: 'sort',
//             data: {
//                 key: data.key,
//             }
//         });
//         return this;
//     }

//     /**
//      * @des feature3:数据分组
//      */
//     groupBy(data: groupByType["data"]) {
//         this.operations.push({
//             type: 'group',
//             data: {
//                 key: data.key,
//             }
//         });
//         return this;
//     }
//     /**
//      * @des feature4:类名转化
//      */
//     transformBy(data: transformByType["data"]) {
//         this.operations.push({
//             type: 'transform',
//             data: {
//                 key: data.key
//             }
//         });
//         return this;
//     }

//     /**
//      * @des 这里考虑到 多种分组方式，传入函数
//      * @param operation.data.key function
//      */
//     #groupByFn(operation: any, data: any): any {
//         const groups: Record<any, any> = {};
//         data.forEach((item: any) => {
//             const groupKey = operation.data.key(item);
//             if (!groups[groupKey]) {
//                 groups[groupKey] = [];
//             }
//             groups[groupKey].push(item);
//         });
//         return groups
//     }
//     /**
//      * @des 这里考虑到 多种分组方式，传入函数
//      * @param operation.data.key function
//      */
//     #sortByFn(operation: sortByType, data: any) {
//         data = data.sort(operation.data.key);
//         return data
//     }

//     #transform(operation: transformByType, data: any) {
//         let res = data.map((value: any) => {
//             value = operation.data.key(value)
//             return value
//         })
//         return res
//     }
//     /**
//      * @des 数据执行
//      * @returns
//      */
//     execute(): any {
//         let result = [...this.data];
//         this.operations.forEach((operation: operationItemType) => {
//             if (operation.type === 'where') {
//                 result = result.filter(operation.data.key);
//             }
//             if (operation.type === 'sort') {
//                 result = this.#sortByFn(operation, result)
//             }
//             if (operation.type === 'group') {
//                 result = this.#groupByFn(operation, result)
//             }
//             if (operation.type === 'transform') {
//                 result = this.#transform(operation, result)
//             }
//         });

//         return result;
//     }
// }
//   const itemList = [
//     { id: 1, name: '商品1', category: '家居百货', saleCount: 20 },
//     { id: 2, name: '商品2', category: '个护美妆', saleCount: 18 },
//     { id: 3, name: '商品3', category: '水乳饮品', saleCount: 33 },
//     { id: 4, name: '商品4', category: '休闲零食', saleCount: 42 },
//     { id: 5, name: '商品5', category: '个护美妆', saleCount: 50 },
//     { id: 6, name: '商品6', category: '休闲零食', saleCount: 37 },
//     { id: 7, name: '商品7', category: '休闲零食', saleCount: 48 },
//     { id: 8, name: '商品8', category: '家居百货', saleCount: 79 },
//     { id: 9, name: '商品9', category: '休闲零食', saleCount: 26 },
//     { id: 10, name: '商品10', category: '家居百货', saleCount: 10 },
//   ];

//   function convert(itemList) {
//     // 你的代码实现...
//     let GroupFn = (data)=>{
//         return data.category
//     }
//     let SortFn = (a,b)=>{
//         return a.saleCount - b.saleCount
//     }
//     let cloneData = JSON.parse(JSON.stringify(itemList))
//     let instance = new Handle(cloneData).sortBy({key:SortFn}).groupBy({key:GroupFn}).execute()
//     console.log(instance)
//   }
//   console.log(convert(itemList));

//   /* [
//    *   {
//    *     "category": "休闲零食",
//    *     "items": [
//    *       { "id": 7, "name": "商品7", "category": "休闲零食", "saleCount": 48 },
//    *       { "id": 4, "name": "商品4", "category": "休闲零食", "saleCount": 42 },
//    *       { "id": 6, "name": "商品6", "category": "休闲零食", "saleCount": 37 },
//    *       { "id": 9, "name": "商品9", "category": "休闲零食", "saleCount": 26 }
//    *     ]
//    *   },
//    *   {
//    *     "category": "家居百货",
//    *     "items": [
//    *       ...
//    *     ]
//    *   },
//    *   ...
//    * ]
//    */

//   /**
//    * 四、
//    * 请通过 React Hooks API 实现一个具有倒计时功能的自定义 Hook useCountdown，
//    * 要求可以使组件每秒自动更新倒计时。
//    * 当超过倒计时截止时间 targetDate 时，变成正计时（返回的 expired 为 false)
//    *
//    * @param {Date} targetDate 倒计时截止时间
//    */

//   function useCountdown(targetDate) {
//     // 你的代码实现...

//     let [timeNumber,setNumber] = useState(targetDate)
//     // 用 settimeout 修正 setinterial
//     const count = () => {
//         const now = new Date().getTime();
//         const difference = targetDate.getTime() - now;
//         const expired = difference < 0;

//         const days = Math.floor(difference / (1000 * 60 * 60 * 24));
//         const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//         const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
//         const seconds = Math.floor((difference % (1000 * 60)) / 1000);

//         return {
//           expired,
//           days,
//           hours,
//           minutes,
//           seconds,
//         };
//     };
//     // 返回的数据结构示例
//     return {
//       expired: false, // 是否已超期
//       days: 0, // 剩余或已超过天数（整数），无上限
//       hours: 0, // 剩余或已超过小时（整数），0~23
//       minutes: 0, // 剩余或已超过分钟数（整数），0~59
//       seconds: 0, // 剩余或已超过秒数（整数），0~59
//     };
//   }

// /**
//  for (let [key, val] of Object.entries(attr)) {
//         this[key] = val
//     }
//  *
//  */
