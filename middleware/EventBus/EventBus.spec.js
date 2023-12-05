let {EventBus} = require("../../commonjs_build/middleware/EventBus/EventBus.js")

let testEventBus = new EventBus()

testEventBus.on("test1",(data)=>{
    console.log(data)
})
testEventBus.emit("test1",45)
describe('EventBus', () => {

    // f1: 错误+基础事件触发
    test('EventBus/event', () => {
        testEventBus.on("test1",(data)=>{
            expect(data).toBe(45);
        })
        testEventBus.emit("test1",45)
        
    });  

   
   
})