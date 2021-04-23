"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serveCommand = void 0;
// Command() creates instance of command for us to implement
var commander_1 = require("commander");
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
exports.serveCommand = new commander_1.Command()
    .command('serve [filename]')
    .description('Open a file for editing')
    .option('-p, --port <number>', 'port to run server on', '4005')
    .action(function (filename, options) {
    if (filename === void 0) { filename = 'notebook.js'; }
    console.log(filename, options);
});
// To run command from command line node index.js serve
