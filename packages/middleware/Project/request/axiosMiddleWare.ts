/**
 * @des 给加中间件
 */
let cid = "";
export let middlewareFetch = (fn) => {
	return (
		...data: [axiosInstanceType, AxiosResponse | CreateAxiosOptions] | any
	) => {
		// if (!data.cid) {
		// 	data.cid = cid;
		// }
		console.log("劫持:", data);
		return fn(...data);
	};
};

let fe = (param) => {
	console.log("param:", param);
};
middlewareFetch(fe)("ddddddddd");
