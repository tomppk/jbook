#!/usr/bin/env node
// Above line enables running executable without typing node
import { program } from 'commander';
import { serveCommand } from './commands/serve';

// Associate commands together
// If we would have additional commands they would be chained together eg.
// program
//  .addCommand(serveCommand)
//  .addCommand(publishCommand)
program.addCommand(serveCommand);

// Tells commander to look for command line commands and parse them and figure out
// which command user is trying to run. If it is a command defined in
// program.addCommand() then it will run the appropriate command.
program.parse(process.argv);
