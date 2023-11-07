let sleep1 = function (timeout) {
    console.log("sleep:", this);
    return new Promise((resolve, reject) => {
        console.log(timeout);
        setTimeout(() => {
            resolve(timeout);
        }, timeout);
    });
};
let temp = Object.getPrototypeOf(sleep1(2500));
console.log(temp);
// .constructor(500).then((e)=>{
//     console.log("???")
// })
