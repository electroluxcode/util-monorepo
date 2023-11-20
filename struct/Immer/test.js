const ObjectTest = {
	id: 5,
	a: {
		id: 3,
	},
};

const FnTest = (name) => {
	console.log(`name的值${name}`);
	return "FnTest的返回值";
};

function FnTest2(name) {
	console.log(`name的值${name}`);
	return "FnTest的返回值";
}


// 这里注意一个
const handler = {
	/**
	 * @f1 函数拦截
	 * @param {*} target ()=>{}
	 * @param {*} thisArg this
	 * @param {*} argumentsList array<string>
	 * @returns
	 */
	apply: function (target, thisArg, argumentsList) {
		console.log(
			`handler/apply/target, thisArg, argumentsList :`,
			target,
			thisArg,
			argumentsList
		);
		return target(...argumentsList);
	},
	/**
	 * @f2 拦截new 注意如果是 function 不能是 箭头函数
	 * @param {*} target ()=>{}
	 * @param {*} argumentsList
	 * @returns
	 */
	construct(target, argumentsList) {
		console.log(`handler/construct/target:`, target);
		return new target(...argumentsList);
	},

	/**
	 * @f4
	 * @param {*} obj 目标对象
	 * @param {*} prop 目标属性key
	 * @param {*} value 目标属性value
	 * @returns
	 */
	get(obj, prop) {
		console.log(`handler/get/obj, prop:`, obj, prop);
		return obj[prop];
	},
	/**
	 * @f5
	 * @param {*} obj 目标对象
	 * @param {*} prop 目标属性key
	 * @param {*} value 目标属性value
	 * @returns
	 */
	set(obj, prop, value) {
		console.log(`handler/set/obj, prop, value:`, obj, prop, value);
		if (prop === "eyeCount" && value % 2 !== 0) {
			console.log("Monsters must have an even number of eyes");
		} else {
            console.log("handler/set/arguments:",arguments)
			return Reflect.set(obj,prop,value);
		}
	},
};

// let test1 = new Proxy(ObjectTest,handler)
// test1.id=5

// let test2 = new Proxy(FnTest,handler)
// console.log(test2("nihaodddd"))

// let test3 = new Proxy(FnTest2,handler)
// new test3("nihaodddd")

let test4 = new Proxy(ObjectTest, handler);
// test4.id = 2
test4.a = "修改后"





// let test45 = {

// }


let arr2 = {
    id: 7,
    name: "d",
    [Symbol.iterator]: function* () {
      for (const key of Object.keys(this)) {
        yield key;
      }
    },
  };
  
  for (let i of arr2) {
    console.log(i);
  }
  
// Reflect.set(test45)


