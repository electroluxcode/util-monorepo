function SwitchFunction(str){
    let temp
    temp = (Function("return " + str))()
    return temp
}

let test = SwitchFunction(`function a(param){console.log(param)}`)
console.log(test)