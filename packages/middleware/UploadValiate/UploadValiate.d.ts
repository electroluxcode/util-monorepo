type BaseValiateType = {
    accept: Array<string>;
    maxCount: number;
    formatTitle?: string;
    limit: (e: any) => Promise<string>;
};
export declare const DefalutUploadConfig: Record<string, BaseValiateType>;
export {};
