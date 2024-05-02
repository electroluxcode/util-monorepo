"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("./index.js");
const error_js_1 = require("./plugin/error.js");
let t = new index_js_1.Tracking({
    plugins: {
        errorPlugin: error_js_1.errorPlugin,
    },
    config: {},
    reportConfig: {
        baseUrl: "http://127.0.0.1:8098/api/get",
        type: "beacon",
    },
});
// t.pluginGet("errorPlugin");
