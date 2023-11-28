
type BaseConfigType = {
    // 基础api
    BaseUrl?: string,
    // 最大超时时间
    TimeOut: number,
    // 最大重试次数
    Retry: number
    // 最大并发
    MaxConcurrent: number
    // 目前的并发数
    NowConcurrentNumber: number
    // 给用户两种模式。
    // hook模式是可以自己定义 BaseEventType 里面的回调(sse)
    // common 模式是跟 axios 一样，导出一个实例然后挂载url(get post)
    Mode?: "hook" | "common",

    BeforeRequest: <t>(param: t) => t,
    ErrorRequest?: (...param: any) => any,
    BeforeResponse: (...param: any) => any,
    ErrorResponse?: (...param: any) => any,
}


type BaseRequestType = {
    url?: string;
    method?: "GET" | "POST" | "SSE";
    data?: any;
    headers: Record<'Accept' | 'Content-Length' | 'User-Agent' | 'Content-Encoding' | 'Authorization', any>;
    mode?: "cors" | "no-cors" | "no-cors" | "same-origin",
    cache?: "no-store" | "default" | "no-cache",
    signal?: any;
    body?: any
}


interface EventSourceMessage {
    id: string;
    event: string;
    data: string;
    retry?: number;
}
type BaseEventType = {
    /**
     * 当接收到响应时调用。用于验证响应是否与预期相符（如果不符合预期，可以抛出错误）。
     * 如果未提供并且method是sse的时候，则会默认进行基本验证，确保内容类型为text/event-stream。
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
