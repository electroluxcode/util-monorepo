"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyMiddleware = exports.compose = exports.combineReducers = exports.createStore = void 0;
const createStore_js_1 = __importDefault(require("./components/createStore.js"));
exports.createStore = createStore_js_1.default;
const combineReducers_js_1 = __importDefault(require("./components/combineReducers.js"));
exports.combineReducers = combineReducers_js_1.default;
const compose_js_1 = __importDefault(require("./components/compose.js"));
exports.compose = compose_js_1.default;
const applyMiddleware_js_1 = __importDefault(require("./components/applyMiddleware.js"));
exports.applyMiddleware = applyMiddleware_js_1.default;
