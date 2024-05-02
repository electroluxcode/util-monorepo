// class Base {
//     constructor() {}
//     // 全部
//     global() {
//         console.log("global");
//     }
//     // 个体特性
//     feature1() {
//         console.log("feature");
//     }
// }
// // 获取 new 后的类型
// type BaseType1 = typeof Base;
// // 创建实例
// const instance = new Base();
// // 获取实例的类型
// const instanceType1: BaseType1 = instance;
// // 使用实例
// instanceType1.global(); // 可正常调用类的方法
// instanceType1.feature1(); // 可正常调用类的方法
