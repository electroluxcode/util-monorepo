type MessageType = {
    data: {
        target: "SSO-ZPTEST";
        type: "close" | "message";
        data: any;
    };
    [key: string]: any;
};
declare let bs: any;
