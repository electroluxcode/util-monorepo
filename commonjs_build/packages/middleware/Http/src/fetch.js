"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchEventSource = void 0;
const parse_js_1 = require("./parse.js");
// fetchEventSource函数用于创建事件流
function fetchEventSource(input, { signal: inputSignal, headers: inputHeaders, onopen: inputOnOpen, onmessage, onclose, onerror, }) {
    return new Promise((resolve, reject) => {
        // step1.0 定义基本变量
        // 定义事件流的内容类型
        const EventStreamContentType = 'text/event-stream';
        // 默认重试间隔为1秒
        let DefaultRetryInterval = 1000;
        // 上一个事件的ID
        const LastEventId = 'last-event-id';
        // 
        let curRequestController;
        let retryTimer = null;
        // ---step1.1 复制输入的headers，因为下面可能会对其进行修改---
        const headers = { ...inputHeaders };
        headers.accept = EventStreamContentType;
        // ---step1.2 错误 和 abort事件 处理---
        function dispose() {
            window.clearTimeout(retryTimer);
            curRequestController.abort();
        }
        // 如果传入的信号中止，则处理资源并解析：
        inputSignal?.addEventListener('abort', () => {
            dispose();
            resolve(); // 不浪费时间构建/记录错误
        });
        // onopen默认判断当前的 content-type是不是 event-stream 有错误直接 throw
        const onopen = inputOnOpen ?? defaultOnOpen;
        // ---step1.3 主方法---
        async function create() {
            curRequestController = new AbortController();
            try {
                const response = await fetch(input, {
                    headers,
                    signal: curRequestController.signal,
                });
                // step1.3.1 获取第一个 response 对象进行 onopen操作
                await onopen(response, EventStreamContentType);
                // step1.3.2 设置 headers用来断点重连. 并且进行 onmessage的输出
                await (0, parse_js_1.getBytes)(response.body, (0, parse_js_1.getLines)((0, parse_js_1.getMessages)(id => {
                    if (id) {
                        // 存储ID，并在下一次重试时发送回服务器：
                        headers[LastEventId] = id;
                    }
                    else {
                        // 不再发送last-event-id头部：
                        delete headers[LastEventId];
                    }
                }, retry => {
                    DefaultRetryInterval = retry;
                }, onmessage)));
                onclose?.();
                dispose();
                resolve();
            }
            catch (err) {
                if (!curRequestController.signal.aborted) {
                    // 如果我们自己没有中止请求：
                    try {
                        // 检查是否需要重试：
                        const interval = onerror?.(err) ?? DefaultRetryInterval;
                        window.clearTimeout(retryTimer);
                        retryTimer = window.setTimeout(create, interval);
                    }
                    catch (innerErr) {
                        // 我们不应再进行重试：
                        dispose();
                        reject(innerErr);
                    }
                }
            }
        }
        create();
    });
}
exports.fetchEventSource = fetchEventSource;
// 默认的onopen函数，用于验证响应的内容类型是否为事件流类型
function defaultOnOpen(response, EventStreamContentType) {
    EventStreamContentType = "text/event-stream";
    const contentType = response.headers.get('content-type');
    if (!contentType?.startsWith(EventStreamContentType)) {
        throw new Error(`Expected content-type to be ${EventStreamContentType}, Actual: ${contentType}`);
    }
}
