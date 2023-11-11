class a {
    a;
    constructor() {
        this.a = 23;
    }
}
class b extends a {
    constructor() {
        super();
    }
}
new b();
// .constructor(500).then((e)=>{
//     console.log("???")
// })
