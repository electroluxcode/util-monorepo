/**
 * 表示事件流中发送的消息
 * https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#Event_stream_format
 */
export interface EventSourceMessage {
    /** The event ID to set the EventSource object's last event ID value. */
    id: string;
    /** A string identifying the type of event described. */
    event: string;
    /** The event data */
    data: string;
    /** The reconnection interval (in milliseconds) to wait before retrying the connection */
    retry?: number;
}
/**
 * 将一个 ReadableStream 转换为回调模式。
 * @param stream 输入的 ReadableStream。
 * @param onChunk 在流中的每个新字节块上调用的函数。
 * @returns {Promise<void>} 当流关闭时将会解析的一个 Promise。
 */
export declare function getBytes(stream: ReadableStream<Uint8Array>, onChunk: (arr: Uint8Array) => void): Promise<void>;
/**
 * 将任意的字节块解析为 EventSource 行缓冲。
 * 每一行应该是 "field: value" 的格式，并以 \r、\n 或 \r\n 结束。
 * @param onLine 在每个新的 EventSource 行上调用的函数。
 * @returns 应该用于每个传入的字节块的函数。
 */
export declare function getLines(onLine: (line: Uint8Array, fieldLength: number) => void): (arr: Uint8Array) => void;
/**
 * 将行缓冲解析成事件源消息（EventSourceMessages）。
 * @param onId 在每个 `id` 字段上调用的函数。
 * @param onRetry 在每个 `retry` 字段上调用的函数。
 * @param onMessage 在每个消息上调用的函数。
 * @returns 应该针对每个传入的行缓冲调用的函数。
 */
export declare function getMessages(onId: (id: string) => void, onRetry: (retry: number) => void, onMessage?: (msg: EventSourceMessage) => void): (line: Uint8Array, fieldLength: number) => void;
