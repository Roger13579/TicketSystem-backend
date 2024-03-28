"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const log4js_1 = __importDefault(require("log4js"));
const config = {
    appenders: {
        info: {
            type: 'console'
        }
    },
    categories: {
        default: { appenders: ['info'], level: 'info' }
    }
};
log4js_1.default.configure(config);
exports.default = log4js_1.default;
