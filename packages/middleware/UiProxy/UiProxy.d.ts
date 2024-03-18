declare class Render {
    container: HTMLElement;
    data: any;
    subscribers: Set<Function>;
    elements: HTMLElement[];
    dependDomArray: any;
    /**
     * @des 初始化
     * @param container
     * @param data
     */
    constructor(container: HTMLElement, data: any);
    /**
     * @des step1:初始化 依赖 | data 绑定 ui
     */
    activeUpdate: (attr: string, isDepend: boolean) => void;
    /**
     * @des step2:  一开始绑定依赖 | ui 绑定 data
     */
    bind(element: HTMLInputElement, data: any, key: string): void;
}
/**
 * @des 依赖收集
 */
declare class Dependency {
    subscribers: Set<Function>;
    activeUpdate: any;
    data: any;
    /**
     * @des 初始化
     * @param container
     * @param data
     */
    constructor(data: any);
    depend(updateUI: Function): void;
    notify(data: any, attr: string): void;
}
/**
 * @des 数据绑定 ui
 * @param data
 * @returns
 */
declare function reactive(data: any): any;
declare let updateUI: any;
declare const app: HTMLElement;
declare const appData: any;
declare const render: Render;
