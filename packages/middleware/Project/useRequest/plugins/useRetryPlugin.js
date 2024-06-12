const useRetryPlugin = (fetchInstance, { retryInterval, retryCount }) => {
    let timerRef = null;
    let countRef = null;
    let triggerByRetry = null;
    console.log("进入插件", {
        fetchInstance,
        retryCount,
        retryInterval,
    });
    if (!retryCount) {
        return {};
    }
    return {
        onBefore: () => {
            if (!triggerByRetry) {
                countRef = 0;
            }
            triggerByRetry = false;
            if (timerRef) {
                clearTimeout(timerRef);
            }
        },
        onSuccess: () => {
            countRef = 0;
        },
        onError: () => {
            countRef += 1;
            if (retryCount === -1 || countRef <= retryCount) {
                // Exponential backoff
                const timeout = retryInterval ?? Math.min(1000 * 2 ** countRef, 30000);
                timerRef = setTimeout(() => {
                    triggerByRetry = true;
                    fetchInstance.refresh();
                }, timeout);
            }
            else {
                countRef = 0;
            }
        },
        onCancel: () => {
            countRef = 0;
            if (timerRef) {
                clearTimeout(timerRef);
            }
        },
    };
};
export default useRetryPlugin;
