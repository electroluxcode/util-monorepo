/**
 STUN（Simple Traversal of UDP over NATs，NAT 的UDP简单穿越）
是一种网络协议，它允许位于NAT（或多重NAT）后的客户端找出自己的公网地址
这些信息被用来在两个同时处于NAT 路由器之后的主机之间建立UDP通信
* */

/**
 * @des 返回是否需要缓存,true就走缓存
 * @time 指定过期时间
 * @key 指定过期key
 */
function needCache({ time = 5 * 1000, key }) {
	let cacheTime;
	let nowTime = new Date().getTime();
	try {
		cacheTime = localStorage.getItem(key);
		// 没有
		if (!cacheTime) {
			localStorage.setItem(key, String(new Date().getTime()));
			return false;
		}
		cacheTime = Number(cacheTime);
		let isExpire = nowTime - cacheTime > time;
		if (isExpire) {
			localStorage.setItem(key, String(new Date().getTime()));
			console.warn("key-isExpire过期:", isExpire);
			return false;
		} else {
			return true;
		}
	} catch {
		return true;
	}
}

let te = needCache({ time: 5000, key: "newKey" });
// console.log(te);
export async function getUser({ getIp }) {
	return new Promise((resolve) => {
		let result = {};
		if (navigator) {
			result["userAgent"] = navigator.userAgent;
			result["language"] = navigator.language;
		}

		if (getIp) {
			fetch("http://8.130.101.131:8098/api/ip")
				.then((e) => {
					return e.json();
				})
				.then((e) => {
					console.log("结果:", e);
					result["ip"] = e.msg;
					resolve(result);
				});
		} else {
			resolve(result);
		}
	});
}
getUser({ getIp: false }).then((e) => {});
