/**
 * 将一个 ReadableStream 转换为回调模式。
 * @param stream 输入的 ReadableStream。
 * @param onChunk 在流中的每个新字节块上调用的函数。
 * @returns {Promise<void>} 当流关闭时将会解析的一个 Promise。
 */
export async function getBytes(stream, onChunk) {
    const reader = stream.getReader();
    // @ts-ignore
    let result;
    while (!(result = await reader.read()).done) {
        onChunk(result.value);
    }
}
/**
 * 将任意的字节块解析为 EventSource 行缓冲。
 * 每一行应该是 "field: value" 的格式，并以 \r、\n 或 \r\n 结束。
 * @param onLine 在每个新的 EventSource 行上调用的函数。
 * @returns 应该用于每个传入的字节块的函数。
 */
export function getLines(onLine) {
    let buffer;
    let position; // current read position
    let fieldLength; // length of the `field` portion of the line
    let discardTrailingNewline = false;
    // 返回一个能处理每个传入字节块的函数
    return function onChunk(arr) {
        if (buffer === undefined) {
            buffer = arr;
            position = 0;
            fieldLength = -1;
        }
        else {
            // 解析旧的并且 将新的字节追加到缓冲区中
            buffer = concat(buffer, arr);
        }
        const bufLength = buffer.length;
        let lineStart = 0; // index where the current line starts
        while (position < bufLength) {
            if (discardTrailingNewline) {
                if (buffer[position] === 10 /* ControlChars.NewLine */) {
                    lineStart = ++position; // 下一行
                }
                discardTrailingNewline = false;
            }
            // 开始向前查找直到行的末尾
            let lineEnd = -1; // index of the \r or \n char
            for (; position < bufLength && lineEnd === -1; ++position) {
                switch (buffer[position]) {
                    case 58 /* ControlChars.Colon */:
                        if (fieldLength === -1) { // first colon in line
                            fieldLength = position - lineStart;
                        }
                        break;
                    // @ts-ignore:7029 \r case 下面的情况应该继续执行到换行符:
                    case 13 /* ControlChars.CarriageReturn */:
                        discardTrailingNewline = true;
                    case 10 /* ControlChars.NewLine */:
                        lineEnd = position;
                        break;
                }
            }
            if (lineEnd === -1) {
                // 我们已经到达缓冲区的末尾，但是行尚未结束。
                // 等待下一个字节数组，然后继续解析
                break;
            }
            // 解析到行尾，发送出去
            onLine(buffer.subarray(lineStart, lineEnd), fieldLength);
            lineStart = position; // we're now on the next line
            fieldLength = -1;
        }
        if (lineStart === bufLength) {
            buffer = undefined; // we've finished reading it
        }
        else if (lineStart !== 0) {
            // 创建一个从lineStart开始的新的缓冲区视图，这样当我们获取新的字节数组时就不需要复制之前的行了
            buffer = buffer.subarray(lineStart);
            position -= lineStart;
        }
    };
}
/**
 * 将行缓冲解析成事件源消息（EventSourceMessages）。
 * @param onId 在每个 `id` 字段上调用的函数。
 * @param onRetry 在每个 `retry` 字段上调用的函数。
 * @param onMessage 在每个消息上调用的函数。
 * @returns 应该针对每个传入的行缓冲调用的函数。
 */
export function getMessages(onId, onRetry, onMessage) {
    let message = newMessage();
    const decoder = new TextDecoder();
    // 返回一个能处理每个传入行缓冲区的函数
    return function onLine(line, fieldLength) {
        if (line.length === 0) {
            // empty line denotes end of message. Trigger the callback and start a new message:
            onMessage?.(message);
            message = newMessage();
        }
        else if (fieldLength > 0) { // exclude comments and lines with no values
            // 排除注释和没有值的行
            // 行的格式为 "<field>:<value>" 或 "<field>: <value>"
            // https://html.spec.whatwg.org/multipage/server-sent-events.html#event-stream-interpretation
            const field = decoder.decode(line.subarray(0, fieldLength));
            const valueOffset = fieldLength + (line[fieldLength + 1] === 32 /* ControlChars.Space */ ? 2 : 1);
            const value = decoder.decode(line.subarray(valueOffset));
            switch (field) {
                case 'data':
                    // if this message already has data, append the new value to the old.
                    // otherwise, just set to the new value:
                    message.data = message.data
                        ? message.data + '\n' + value
                        : value; // otherwise, 
                    break;
                case 'event':
                    message.event = value;
                    break;
                case 'id':
                    onId(message.id = value);
                    break;
                case 'retry':
                    const retry = parseInt(value, 10);
                    if (!isNaN(retry)) { // per spec, ignore non-integers
                        onRetry(message.retry = retry);
                    }
                    break;
            }
        }
    };
}
/**
 * @des 辅助函数：拼接两个 Uint8Array
 * @param a
 * @param b
 * @returns
 */
function concat(a, b) {
    const res = new Uint8Array(a.length + b.length);
    res.set(a);
    res.set(b, a.length);
    return res;
}
/**
 * @des 辅助函数：创建一个新的 EventSourceMessage 对象
 * @returns
 */
function newMessage() {
    // data, event, and id must be initialized to empty strings:
    // https://html.spec.whatwg.org/multipage/server-sent-events.html#event-stream-interpretation
    // retry should be initialized to undefined so we return a consistent shape
    // to the js engine all the time: https://mathiasbynens.be/notes/shapes-ics#takeaways
    return {
        data: '',
        event: '',
        id: '',
        retry: undefined,
    };
}
