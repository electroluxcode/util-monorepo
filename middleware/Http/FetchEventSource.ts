export interface EventSourceMessage {
    id: string;
    event: string;
    data: string;
    retry?: number;
}



export async function getBytes(stream: ReadableStream<Uint8Array>, onChunk: (arr: Uint8Array) => void): Promise<void> {
    const reader = stream.getReader();
    let result: ReadableStreamReadResult<Uint8Array>;
    while (!(result = await reader.read()).done) {
        onChunk(result.value);
    }
}

export function getLines(onLine: (line: Uint8Array, fieldLength: number) => void): (arr: Uint8Array) => void {
    let buffer: Uint8Array | undefined;
    let position: number;
    let fieldLength: number;
    let discardTrailingNewline: boolean = false;
    return function onChunk(arr: Uint8Array): void {
        if (buffer === undefined) {
            buffer = arr;
            position = 0;
            fieldLength = -1;
        } else {
            buffer = concat(buffer, arr);
        }
        const bufLength = buffer.length;
        let lineStart = 0;
        while (position < bufLength) {
            if (discardTrailingNewline) {
                if (buffer[position] === 10) {
                    lineStart = ++position;
                }
                discardTrailingNewline = false;
            }
            let lineEnd = -1;
            for (; position < bufLength && lineEnd === -1; ++position) {
                switch (buffer[position]) {
                    case 58:
                        if (fieldLength === -1) {
                            fieldLength = position - lineStart;
                        }
                        break;
                    case 13:
                        discardTrailingNewline = true;
                    case 10:
                        lineEnd = position;
                        break;
                }
            }
            if (lineEnd === -1) {
                break;
            }
            onLine(buffer.subarray(lineStart, lineEnd), fieldLength);
            lineStart = position;
            fieldLength = -1;
        }
        if (lineStart === bufLength) {
            buffer = undefined;
        } else if (lineStart !== 0) {
            buffer = buffer.subarray(lineStart);
            position -= lineStart;
        }
    };
}

export function getMessages(
    onMessage?: (msg: EventSourceMessage) => void,
    onId?: (id: string) => void,
    onRetry?: (retry: number) => void
): (line: Uint8Array, fieldLength: number) => void {
    let message: EventSourceMessage = newMessage();
    const decoder = new TextDecoder();
    return function onLine(line: Uint8Array, fieldLength: number): void {
        if (line.length === 0) {
            onMessage?.(message);
            message = newMessage();
        } else if (fieldLength > 0) {
            const field = decoder.decode(line.subarray(0, fieldLength));
            const valueOffset = fieldLength + (line[fieldLength + 1] === 32 ? 2 : 1);
            const value = decoder.decode(line.subarray(valueOffset));
            switch (field) {
                case 'data':
                    message.data = message.data ? message.data + '\n' + value : value;
                    break;
                case 'event':
                    message.event = value;
                    break;
                case 'id':
                    onId?.(message.id = value);
                    break;
                case 'retry':
                    const retry = parseInt(value, 10);
                    if (!isNaN(retry)) {
                        onRetry?.(message.retry = retry);
                    }
                    break;
            }
        }
    };
}

function concat(a: Uint8Array, b: Uint8Array): Uint8Array {
    const res = new Uint8Array(a.length + b.length);
    res.set(a);
    res.set(b, a.length);
    return res;
}

function newMessage(): EventSourceMessage {
    return {
        data: '',
        event: '',
        id: '',
        retry: undefined,
    };
}
