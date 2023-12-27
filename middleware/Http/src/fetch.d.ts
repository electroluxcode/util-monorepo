import { EventSourceMessage } from './parse.js';
export interface FetchEventSourceInit {
    /**
     * 请求头部信息。FetchEventSource仅支持Record<string,string>格式。
     */
    headers?: Record<string, string>;
    signal?: AbortSignal | null;
    /**
     * 当接收到响应时调用。用于验证响应是否与预期相符（如果不符合预期，可以抛出错误）。
     * 如果未提供，则会默认进行基本验证，确保内容类型为text/event-stream。
     */
    onopen?: (response: Response) => Promise<void>;
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
    onerror?: (err: any) => number | null | undefined | void;
}
export declare function fetchEventSource(input: string, { signal: inputSignal, headers: inputHeaders, onopen: inputOnOpen, onmessage, onclose, onerror, }: FetchEventSourceInit): Promise<void>;
