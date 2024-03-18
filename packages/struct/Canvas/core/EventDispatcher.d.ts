export type CustomEvent = {
    type: string;
    target?: any;
    [attachment: string]: any;
};
export type EventListener = (event: CustomEvent) => void;
declare class EventDispatcher {
    _listeners: {};
    on(type: string, listener: EventListener): void;
    hasEmit(type: string, listener: EventListener): boolean;
    removeEmit(type: string, listener: EventListener): void;
    emit(event: CustomEvent): void;
}
export { EventDispatcher };
