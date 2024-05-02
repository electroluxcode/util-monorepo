import { Tracking } from "./index.js";
import { errorPlugin } from "./plugin/error.js";
let t = new Tracking({
    plugins: {
        errorPlugin,
    },
    config: {},
    reportConfig: {
        baseUrl: "http://127.0.0.1:8098/api/get",
        type: "beacon",
    },
});
// t.pluginGet("errorPlugin");
