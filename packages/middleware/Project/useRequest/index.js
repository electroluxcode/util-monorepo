import Fetch from "./Fetch.js";
const service = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ id: 4 });
        }, 1000);
    });
};
let fetchOptions = {
    manual: false,
};
let initState = {
    loading: true,
};
const useRequest = (service, options = {}, plugins = []) => {
    const { manual = false, ...rest } = options;
    let initState = plugins.map((p) => p?.onInit?.(fetchOptions)).filter(Boolean);
    console.log(initState, "ddddddddd");
    const fetchInstance = new Fetch(service, fetchOptions, 
    // constructor | cancel | mutate | runAsync(初始化来一次loading )
    options.subscribe ??
        function (e) {
            console.log("订阅:", JSON.parse(JSON.stringify(e)));
        }, Object.assign({}, ...initState));
    if (!manual) {
        const params = fetchInstance.state.params || options.defaultParams || [];
        // @ts-ignore
        fetchInstance.run(...params);
    }
    return {
        ...fetchInstance.state,
        cancel: fetchInstance.cancel.bind(fetchInstance),
        mutate: fetchInstance.mutate.bind(fetchInstance),
        refresh: fetchInstance.refresh.bind(fetchInstance),
        refreshAsync: fetchInstance.refreshAsync.bind(fetchInstance),
        run: fetchInstance.run.bind(fetchInstance),
        runAsync: fetchInstance.runAsync.bind(fetchInstance),
    };
};
let { loading, run } = useRequest(service, {
    manual: true,
    subscribe: (e) => {
        console.log("ddd", e);
    },
    retryCount: 2,
});
setTimeout(() => {
    run();
}, 100);
