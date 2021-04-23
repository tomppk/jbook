"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serve = void 0;
var express_1 = __importDefault(require("express"));
var serve = function (port, filename, dir) {
    var app = express_1.default();
    // Wrap starting express server listening inside a custom Promise to enable
    // async error handling in CLI.
    // The Promise will be resolved or rejected at some point in time.
    // If we successfully start up our server and start listening then resolve
    // function will be called automatically which resolves the Promise.
    // If something goes wrong with starting express server reject function is
    // called. That will reject Promise and put it in error state which will in
    // turn throw an error at CLI serve command try/catch block.
    return new Promise(function (resolve, reject) {
        app.listen(port, resolve).on('error', reject);
    });
};
exports.serve = serve;
