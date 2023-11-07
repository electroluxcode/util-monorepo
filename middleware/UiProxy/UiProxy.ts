
// const fn = (name) => {
//     console.log('我是：', name)
// }

// const p2 = new Proxy(fn, {
//     // 使用 apply 拦截函数调用
//     apply(target, thisArg, argArray) {
//         target.call(thisArg, ...argArray)
//     }
// })

// p2('lc') // 输出：'我是：lc'

// Object.addtest=function (){
//     console.log(...arguments)
// }

// let data = {
//     id:2,
//     name:"测试数据"
// }

// data.addtest("dddd")




class Render {
    container!: HTMLElement;
    data!: any
    subscribers: Set<Function>
    elements!: HTMLElement[]
    dependDomArray: any
    /**
     * @des 初始化
     * @param container 
     * @param data 
     */
    constructor(container: HTMLElement, data: any) {

        this.subscribers = new Set();
        this.container = container
        this.data = data
        this.dependDomArray = []
        Object.keys(this.data).forEach((v: string) => {
            console.log(":::", v)
            this.activeUpdate(v, false)
        })
        
    }

    /**
     * @des step1:初始化 依赖 | data 绑定 ui
     */
    activeUpdate = (attr: string, isDepend: boolean) => {
        this.elements = document.querySelectorAll(`[bind="${attr}"]`) as unknown as HTMLElement[]
       
        this.elements.forEach((element: any) => {
            const key = element.getAttribute('bind');
            element.value = this.data[key];
            if (isDepend) {

            }
            this.bind(element, this.data, key);
        });
    };

    /**
     * @des step2:  一开始绑定依赖 | ui 绑定 data
     */
    bind(element: HTMLInputElement, data: any, key: string) {
        console.log(" bind--------",element,key)
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            element.value = data[key];
            element.addEventListener('input', (event: Event) => {
                // console.log("dsdssdsd",event,data,key)
                if (event) {
                    data[key] = (event.target as HTMLInputElement).value;
                    // updateUI(data, key)
                }
            });
        } else {
            element.textContent = data[key];
        }
    }

    /**
     * @des step3: data 绑定 ui
     */
    
}

/**
 * @des 依赖收集
 */
class Dependency {
    subscribers: Set<Function>
    activeUpdate!: any
    data:any
    /**
     * @des 初始化
     * @param container 
     * @param data 
     */
    constructor(data: any) {
        this.subscribers = new Set();
      
        // Object.keys(data).forEach((v: string) => {
        //     console.log(":::", v)

        // })

        // this.activeUpdate = activeUpdate
    }
    depend(updateUI: Function) {
        if (updateUI) {
            this.subscribers.add(updateUI);
        }
    }
    notify(data:any,attr: string) {
        console.log("notify:", this.subscribers)
        this.subscribers.forEach(subscriber => {
            subscriber(data, attr)
        });
    }
}



/**
 * @des 数据绑定 ui
 * @param data 
 * @returns 
 */
function reactive(data: any) {
  

    Object.keys(data).forEach((key: any, i: number) => {
        let internalValue = data[key];
        const dep = new Dependency(data);


        Object.defineProperty(data, key, {
            /**
             * @des 收集依赖
             */
            get() {
                if (updateUI) {
                    dep.depend(updateUI);
                    console.log("reactive get:", key, updateUI)
                  
                }

                return internalValue;
            },
            /**
             * @des 这里通知ui改变 | 触发依赖
             */
            set(newValue) {
                internalValue = newValue;
                dep.notify(data,key);
                  
            }
        });
    });
    return data;
}


let updateUI: any =function(data: any, key: string) {
    const elements = document.querySelectorAll(`[bind="${key}"]`);
    console.log("updateUI:",elements)
    elements.forEach((element: any) => {
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            element.value = data[key];
        } else {
            element.textContent = data[key];
        }
    });
}
const app = document.getElementById('app')!;
// 示例
const appData = reactive({
    message: 'Hello, Custom Framework!'
});

const render = new Render(app, appData)

// const dep = new Dependency();
// compileTemplate(app, appData);
// document.querySelector()


// <!DOCTYPE html>
// <html lang="en">

// <head>
//     <meta charset="UTF-8">
//     <meta http-equiv="X-UA-Compatible" content="IE=edge">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Document</title>
// </head>

// <body>


//     <div id="app">
//         <input type="text" bind="message">
//         <p>您输入的内容是：<span bind="message"></span></p>
//     </div>
//     <script src="proxy.js">

//     </script>
// </body>

// </html>

