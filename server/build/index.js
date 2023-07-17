"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotnev/config");
const app = (0, express_1.default)();
const SERVER_PORT = process.env.PORT || 5000;
app.listen(SERVER_PORT, () => {
    console.log(`The server has started running at port ${SERVER_PORT}`);
});
