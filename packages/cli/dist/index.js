#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Above line enables running executable without typing node
var commander_1 = require("commander");
var serve_1 = require("./commands/serve");
// Associate commands together
// If we would have additional commands they would be chained together eg.
// program
//  .addCommand(serveCommand)
//  .addCommand(publishCommand)
commander_1.program.addCommand(serve_1.serveCommand);
// Tells commander to look for command line commands and parse them and figure out
// which command user is trying to run. If it is a command defined in
// program.addCommand() then it will run the appropriate command.
commander_1.program.parse(process.argv);
