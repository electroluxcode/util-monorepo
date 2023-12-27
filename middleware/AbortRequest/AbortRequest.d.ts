declare class AbortRequest {
    list: Map<any, any>;
    create(key: any): AbortSignal;
    remove(key: any): void;
}
export default AbortRequest;
