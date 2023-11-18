import { EventSourceMessage, getBytes, getLines, getMessages } from './parse.js';



// 定义FetchEventSourceInit接口
export interface FetchEventSourceInit  {
    /**
     * 请求头部信息。FetchEventSource仅支持Record<string,string>格式。
     */
    headers?: Record<string, string>,
    signal?: AbortSignal | null;
    /**
     * 当接收到响应时调用。用于验证响应是否与预期相符（如果不符合预期，可以抛出错误）。
     * 如果未提供，则会默认进行基本验证，确保内容类型为text/event-stream。
     */
    onopen?: (response: Response) => Promise<void>,

    /**
     * 当接收到消息时调用。注意：与默认的浏览器EventSource.onmessage不同，
     * 此回调用于处理所有事件，甚至具有自定义“event”字段的事件。
     */
    onmessage?: (ev: EventSourceMessage) => void;

    /**
     * 当响应完成时调用。如果不希望服务器关闭连接，可以在此处抛出异常并使用onerror重试。
     */
    onclose?: () => void;

    /**
     * 处理发生任何错误时调用，包括请求制作、消息处理、回调处理等。
     * 可以利用此功能控制重试策略：如果错误是致命的，请在回调函数中重新抛出错误以停止整个操作。
     * 否则，可以返回一个间隔时间（毫秒），在此时间后将自动重试请求（使用last-event-id）。
     * 如果未指定此回调函数，或者它返回undefined，则fetchEventSource将将每个错误视为可重试，并将在1秒后尝试再次请求。
     */
    onerror?: (err: any) => number | null | undefined | void,
}

// fetchEventSource函数用于创建事件流
export function fetchEventSource(input: string, {
    signal: inputSignal,
    headers: inputHeaders,
    onopen: inputOnOpen,
    onmessage,
    onclose,
    onerror,
}: FetchEventSourceInit) {
    return new Promise<void>((resolve, reject) => {

        // step1.0 定义基本变量

        // 定义事件流的内容类型
        const EventStreamContentType = 'text/event-stream';
        // 默认重试间隔为1秒
        let DefaultRetryInterval = 1000;
        // 上一个事件的ID
        const LastEventId = 'last-event-id';
        // 
        let curRequestController: AbortController;
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
                await onopen(response,EventStreamContentType);
               
                // step1.3.2 设置 headers用来断点重连. 并且进行 onmessage的输出
                await getBytes(response.body!, getLines(getMessages(id => {
                    if (id) {
                        // 存储ID，并在下一次重试时发送回服务器：
                        headers[LastEventId] = id;
                    } else {
                        // 不再发送last-event-id头部：
                        delete headers[LastEventId];
                    }
                }, retry => {
                    DefaultRetryInterval = retry;
                }, onmessage)));

                onclose?.();
                dispose();
                resolve();
            } catch (err) {
                if (!curRequestController.signal.aborted) {
                    // 如果我们自己没有中止请求：
                    try {
                        // 检查是否需要重试：
                        const interval: any = onerror?.(err) ?? DefaultRetryInterval;
                        window.clearTimeout(retryTimer);
                        retryTimer = window.setTimeout(create, interval);
                    } catch (innerErr) {
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

// 默认的onopen函数，用于验证响应的内容类型是否为事件流类型
function defaultOnOpen(response: Response,EventStreamContentType) {
    EventStreamContentType = "text/event-stream"
    const contentType = response.headers.get('content-type');
    if (!contentType?.startsWith(EventStreamContentType)) {
        throw new Error(`Expected content-type to be ${EventStreamContentType}, Actual: ${contentType}`);
    }
}
