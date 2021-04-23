"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serveCommand = void 0;
// Path is part of Node standard library. Functions to help calculate different
// paths on a file system
var path_1 = __importDefault(require("path"));
// Command() creates instance of command for us to implement
var commander_1 = require("commander");
var local_api_1 = require("local-api");
// Create instance of Command() from commander library designed to help building
// CLI tools. Chain on method calls to customize the Command object.
// command('nameOfCommand') defines what command we want to watch for. When user
// runs this we are going to execute the logic associated to this command.
// [filename] indicates optional value
// description('describe what command does') for --help command
// commander automatically generates --help command to show all commands
// option('opt1, opt1v2', 'description of option', 'default value') add optional
// flags for commands. <number> indicates a required value
// action(callback) callback is going to run when this command is invoked
// so the actual logic of the command.
// Action function receives as first argument optional value from .command
// Second argument object containing different options
// Execute serve(port, filename, directory) function defined in 'local-api'
// package. serve() is async function as it is wrapped inside Promise.
// process.cwd() returns absolute path to directory where user ran the
// command from eg. home/projects/tbook/packages/cli
// path.dirname(filename) returns directory name that is specified inside
// filename string so if relative path specified returns folder name
// eg. if input is notes/notebook.js returns notes/ or if just filename
// inputted then returns empty string ''
// These two directory paths are joined together to get final path
// path.basename(filename) returns just filename from relative path
// Add script to replace process.env.NODE_ENV with 'production' before pushing
// code to npm. When user gets this package from npm isProduction = true.
// If running on local dev environment NODE_ENV is likely not set or 'development'
// so isProduction = false and we do not want to useProxy at local-api
var isProduction = process.env.NODE_ENV === 'production';
exports.serveCommand = new commander_1.Command()
    .command('serve [filename]')
    .description('Open a file for editing')
    .option('-p, --port <number>', 'port to run server on', '4005')
    .action(function (filename, options) {
    if (filename === void 0) { filename = 'notebook.js'; }
    return __awaiter(void 0, void 0, void 0, function () {
        var dir, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    dir = path_1.default.join(process.cwd(), path_1.default.dirname(filename));
                    return [4 /*yield*/, local_api_1.serve(parseInt(options.port), path_1.default.basename(filename), dir, !isProduction)];
                case 1:
                    _a.sent();
                    console.log("Opened " + filename + ". Navigate to http://localhost:" + options.port + " to edit the file.");
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    if (err_1.code === 'EADDRINUSE') {
                        console.error('Port is in use. Try running on different port.\n(use "serve [filename] --port <number>" to change port.)');
                    }
                    else {
                        console.log('Error! Something went wrong:', err_1.message);
                    }
                    // If end up in catch error block then forcibly exit program
                    // exit with status code 1: exiting with unsuccessful run of program
                    process.exit(1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
});
// To run command from command line node index.js serve
// console.log(path.join(process.cwd(), path.dirname(filename)));
// console.log(path.basename(filename));
