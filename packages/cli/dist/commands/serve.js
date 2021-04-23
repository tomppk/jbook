"use strict";
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
// package
// process.cwd() returns absolute path to directory where user ran the
// command from eg. home/projects/tbook/packages/cli
// path.dirname(filename) returns directory name that is specified inside
// filename string so if relative path specified returns folder name
// eg. if input is notes/notebook.js returns notes/ or if just filename
// inputted then returns empty string ''
// These two directory paths are joined together to get final path
// path.basename(filename) returns just filename from relative path
exports.serveCommand = new commander_1.Command()
    .command('serve [filename]')
    .description('Open a file for editing')
    .option('-p, --port <number>', 'port to run server on', '4005')
    .action(function (filename, options) {
    if (filename === void 0) { filename = 'notebook.js'; }
    var dir = path_1.default.join(process.cwd(), path_1.default.dirname(filename));
    local_api_1.serve(parseInt(options.port), path_1.default.basename(filename), dir);
});
// To run command from command line node index.js serve
// console.log(path.join(process.cwd(), path.dirname(filename)));
// console.log(path.basename(filename));
