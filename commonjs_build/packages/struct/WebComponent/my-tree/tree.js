"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tree = void 0;
function insertAfter(newElement, targetElement) {
    let parent = targetElement.parentNode;
    if (parent.lastChild == targetElement) {
        parent.appendChild(newElement);
    }
    else {
        setTimeout(() => {
            parent.insertBefore(newElement, targetElement.nextSibling);
        }, 0);
    }
    parent.insertBefore(newElement, targetElement.nextSibling);
}
/**
 * @des 变成树型结构
 * @param arr
 * @param target
 * @returns
 */
function ArrayToTree(arr, target) {
    let result = [];
    arr.forEach((re) => {
        re.children = arr.filter((res) => {
            return re.key == res.parent;
        });
        if (re.parent == target) {
            result.push(re);
        }
    });
    return result;
}
/**
 * @des 数据结构分成3个 用户的config | 用户传入的tree data | 构建hash表
 * @feature1    动态async ✅
 * @feature2    单选 | 多选 逻辑 ✅
 * @feature3    搜索树 ✅
 * @feature4    拖拽树 ❌
 * @feature5    多选样式 disabled 自定义图标逻辑 ❌
 */
class tree {
    /**
     * @des step1:初始化变量 和 配置文件
     * @param {*} options
     */
    options;
    $container;
    TreeData;
    TreePrefData;
    constructor(options) {
        const defaultOptions = {
            element: null,
            data: [],
            multiple: false,
            toggle: () => { },
            select: () => { },
        };
        this.options = Object.assign({}, defaultOptions, options);
        this.$container = this.options.element;
        this.TreeData = this.options.data;
        console.log(this.options);
        this.TreePrefData = {};
        this.initTree();
        console.log("haihaihai:", this.TreePrefData);
        if (!this.options.multiple) {
            for (let i in this.TreePrefData) {
                this.TreePrefData[this.TreePrefData[i].key].selected = false;
                let dom = this.$container.querySelector(`[tree-id="${this.TreePrefData[i].key}"]`);
                dom?.querySelector(".node-title")?.classList.remove("selected");
            }
        }
    }
    /**
     * @des step2:将数组展开,并且赋予parent属性
     * @param arr
     * @param parent
     * @returns
     */
    flatData(arr, parent) {
        let rets = [];
        for (let i = 0; i < arr.length; i++) {
            arr[i].parent = parent;
            this.TreePrefData[arr[i].key] = arr[i];
            if (arr[i].children) {
                rets = rets.concat(this.flatData(arr[i].children, arr[i].key));
            }
            else {
                rets.push(arr[i]);
            }
        }
        return rets;
    }
    /**
     * @des 将数据重新合并
     */
    mergeData() {
        let res = [];
        for (let i in this.TreePrefData) {
            res.push(this.TreePrefData[i]);
        }
        let temp = ArrayToTree(JSON.parse(JSON.stringify(res)), 0);
        // console.log("mergeData:",temp)
        this.TreeData = temp;
    }
    /**
     * @des step2：全量渲染 | 平级渲染
     */
    initTree() {
        // 遍历树数据并初始化每个节点
        for (let index = 0; index < this.TreeData.length; index++) {
            this.initTreeNode(this.TreeData[index], 0);
        }
        this.flatData(this.TreeData, "0");
    }
    /**
     * @des step3：dfs 递归遍历事件 | 初始化 | 展开
     * @param node 数据格式
     * @param layer 当前层级
     * @param UpdateDom 更新的 dom
     * @param  DeleteDom 删除的dom
     * @returns
     */
    initTreeNode(node, layer, UpdateDom) {
        node.layer = layer;
        let $node;
        if (UpdateDom) {
            $node = this.CreateTreeNode(node, layer, true);
            return insertAfter($node, UpdateDom);
        }
        else {
            $node = this.CreateTreeNode(node, layer);
            this.$container.appendChild($node);
        }
        // 无子集
        if (!node.children) {
            this.$container.appendChild($node);
            return $node;
        }
        // 初始化不扩展的子类
        if (!node.expand) {
            // this.$container.appendChild($node);
            return;
        }
        // 有子集
        for (let i = 0; i < node.children.length; i++) {
            this.initTreeNode(node.children[i], layer + 1);
        }
    }
    /**
     * @des step3：dfs 删除
     * @param node 数据格式
     * @param layer 当前层级
     * @param UpdateDom 更新的 dom
     * @param  DeleteDom 删除的dom
     * @returns
     */
    delTreeNode(node, layer, DeleteDom) {
        if (DeleteDom) {
            if (!node.children) {
                DeleteDom.classList.add("close");
            }
            else {
                this.CloseCollpse(node.key, layer + 1);
                DeleteDom.classList.add("close");
            }
            DeleteDom.addEventListener("animationend", () => {
                DeleteDom.remove();
            });
            return;
        }
    }
    /**
     * @des step4 创造子节点
     * @param node 目前的
     * @param layer 目前的层数
     * @des UpdateTitle 传入就是在更新中
     * @returns
     */
    CreateTreeNode(node, layer, UpdateTitle) {
        const $node = document.createElement("div");
        $node.setAttribute("class", "tree-node");
        // step4.1:添加空格 基本结构的构建 | 设置每一个元素的标志符号
        for (let i = 0; i < layer; i++) {
            let indent = document.createElement("div");
            indent.setAttribute("class", "tree-indent");
            $node.appendChild(indent);
        }
        $node.setAttribute("tree-id", node.key);
        const $nodeContent = document.createElement("div");
        $nodeContent.setAttribute("class", "node-content");
        // step4.2:处理展开符号点击事件
        const $arrow = document.createElement("i");
        if (node.children) {
            let ArrowExpandClass = node.expand ? "open" : "";
            let ArrowSearchedClass = node.searched ? "red" : "";
            if (UpdateTitle) {
                ArrowExpandClass = `${ArrowSearchedClass}`;
            }
            $arrow.setAttribute("class", `node-arrow  fa fa-angle-right ${ArrowExpandClass} ${ArrowSearchedClass} `);
        }
        else {
            let ArrowSearchedClass = node.searched ? "red" : "";
            $arrow.setAttribute("class", `node-arrow hide ${ArrowSearchedClass} `);
        }
        $arrow.addEventListener("click", () => {
            // 改变之前的状态
            if (this.TreePrefData[node.key].expand) {
                $arrow.classList.remove("open");
                this.CloseCollpse(node.key, node.layer);
            }
            else {
                $arrow.classList.add("open");
                this.OpenCollpse(node.key, node.layer);
            }
            this.TreePrefData[node.key].expand = !this.TreePrefData[node.key].expand;
            this.mergeData();
            this.options.toggle.call(null, node);
        });
        // step4.3:处理文字点击事件
        const $title = document.createElement("span");
        const TitleSelectedClass = node.selected ? "selected" : "";
        const TitleSearchedClass = node.searched ? "red" : "";
        $title.setAttribute("class", `node-title ${TitleSelectedClass} ${TitleSearchedClass}`);
        // console.log("触发这个方法:",this.TreePrefData)
        $title.innerText = node.title;
        $title.addEventListener("click", () => {
            // 多选
            let dom = this.$container.querySelector(`[tree-id="${node.key}"]`);
            if (this.options.multiple) {
                dom?.querySelector(".node-title").classList.toggle("selected");
                this.TreePrefData[node.key].selected = !node.selected;
            }
            else {
                // 单选
                for (let i in this.TreePrefData) {
                    this.TreePrefData[this.TreePrefData[i].key].selected = false;
                    let dom = this.$container.querySelector(`[tree-id="${this.TreePrefData[i].key}"]`);
                    dom?.querySelector(".node-title")?.classList.remove("selected");
                }
                this.TreePrefData[node.key].selected = true;
                dom.querySelector(".node-title").classList.toggle("selected");
            }
            this.options.select.call(null, node, this.selectData());
            this.mergeData();
        });
        $nodeContent.appendChild($arrow);
        $nodeContent.appendChild($title);
        // 这个只是加动效
        $nodeContent.classList.add("open");
        $node.appendChild($nodeContent);
        return $node;
    }
    /**
     * @des step5 点击展开的事件
     * @param title 父组件
     * @param layer
     */
    OpenCollpse(title, layer) {
        let dom = this.$container.querySelector(`[tree-id="${title}"]`);
        let data = this.TreePrefData[dom?.getAttribute("tree-id")];
        // this.TreePrefData[dom?.getAttribute("tree-id")!].expand = true
        if (data && data.children) {
            for (let index = data.children.length - 1; index >= 0; index--) {
                data.children[index].expand = false;
                this.initTreeNode(data.children[index], layer + 1, dom);
            }
        }
    }
    /**
     * @des step6 点击关闭的事件
     * @param title
     * @param layer
     */
    CloseCollpse(title, layer) {
        let dom = this.$container.querySelector(`[tree-id="${title}"]`);
        let data = this.TreePrefData[dom?.getAttribute("tree-id")];
        if (data.children) {
            for (let index = data.children.length - 1; index >= 0; index--) {
                data.children[index].expand = false;
                this.delTreeNode(data.children[index], layer + 1, this.$container.querySelector(`[tree-id='${data.children[index].key}']`));
            }
        }
    }
    /**
     * @feature1 动态async 数据
     * TreePrefData 添加传入的东西(附加上parent,这个时候父的箭头需要扩展)。
     * 然后调用mergeData重新组装数据
     */
    asyncData(parent, data) {
        if (!this.TreePrefData[parent]) {
            return;
        }
        for (let i = 0; i < data.length; i++) {
            this.TreePrefData[data[i].key] = data[i];
        }
        this.mergeData();
        // 给父组件箭头 和 显示子组件添加动画
        if (!this.TreePrefData[parent].children) {
            this.TreePrefData[parent].children = [];
            let dom = this.$container.querySelector(`[tree-id="${parent}"]`);
            // dom?.querySelector(`.node-arrow`)?.classList.remove("hide")
            dom?.querySelector(`.node-arrow`)?.setAttribute("class", `node-arrow fa fa-angle-right open`);
            setTimeout(() => {
                console.log("头顶：");
                dom.querySelector(`.node-arrow`)?.click();
                setTimeout(() => {
                    dom.querySelector(`.node-arrow`)?.click();
                }, 100);
                if (!this.options.multiple) {
                    for (let i in this.TreePrefData) {
                        this.TreePrefData[this.TreePrefData[i].key].selected = false;
                        let dom = this.$container.querySelector(`[tree-id="${this.TreePrefData[i].key}"]`);
                        dom?.querySelector(".node-title")?.classList?.remove("selected");
                    }
                    this.mergeData();
                }
            }, 0);
        }
        this.flatData(data, parent);
        this.TreePrefData[parent].children.push(...data);
        this.mergeData();
    }
    /**
     * @feature2 多选功能
     * @returns
     */
    selectData() {
        let res = [];
        for (let i in this.TreePrefData) {
            if (this.TreePrefData[i].selected) {
                res.push(this.TreePrefData[i]);
            }
        }
        return res;
    }
    /**
     * @feature3 搜索树功能
     * @des 获取所有父节点
     */
    searchDataSwitch(ParentId, StopFlag) {
        let parent = [];
        if (this.TreePrefData[ParentId].parent != StopFlag) {
            parent.push(this.TreePrefData[ParentId]);
            parent = parent.concat(this.searchDataSwitch(this.TreePrefData[ParentId].parent, "0"));
        }
        else {
            parent.push(this.TreePrefData[ParentId]);
        }
        return parent;
    }
    /**
     * @feature3 搜索树功能
     * @des 搜索树主要逻辑
     * @param str
     */
    searchData(str) {
        let res = [];
        for (let i in this.TreePrefData) {
            this.TreePrefData[this.TreePrefData[i].key];
            if (this.TreePrefData[i].key.includes(str)) {
                res.push(this.TreePrefData[i]);
            }
        }
        console.log(res);
        res.forEach((v) => {
            let parentArr = this.searchDataSwitch(v.key, "0");
            for (let i = parentArr.length - 1; i >= 1; i--) {
                // 处理展开事件
                setTimeout((param) => {
                    if (this.TreePrefData[param.key].expand || !this.TreePrefData[param.key].children) {
                        return;
                    }
                    let dom = this.$container.querySelector(`[tree-id="${param.key}"]`);
                    dom.querySelector(`.node-arrow`)?.click();
                }, 0, parentArr[i]);
            }
        });
        setTimeout(() => {
            res.forEach((e) => {
                let dom = this.$container.querySelector(`[tree-id="${e.key}"]`);
                this.TreePrefData[e.key].searched = true;
                dom.querySelector(".node-arrow")?.classList.add("red");
                dom.querySelector(".node-title")?.classList.add("red");
            });
            this.mergeData();
        }, 0);
    }
}
exports.tree = tree;
