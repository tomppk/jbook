// Path is part of Node standard library. Functions to help calculate different
// paths on a file system
import path from 'path';
// Command() creates instance of command for us to implement
import { Command } from 'commander';
import { serve } from 'local-api';

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
const isProduction = process.env.NODE_ENV === 'production';

export const serveCommand = new Command()
  .command('serve [filename]')
  .description('Open a file for editing')
  .option('-p, --port <number>', 'port to run server on', '4005')
  .action(async (filename = 'notebook.js', options: { port: string }) => {
    try {
      const dir = path.join(process.cwd(), path.dirname(filename));
      await serve(
        parseInt(options.port),
        path.basename(filename),
        dir,
        !isProduction
      );
      console.log(
        `Opened ${filename}. Navigate to http://localhost:${options.port} to edit the file.`
      );
    } catch (err) {
      if (err.code === 'EADDRINUSE') {
        console.error(
          'Port is in use. Try running on different port.\n(use "serve [filename] --port <number>" to change port.)'
        );
      } else {
        console.log('Error! Something went wrong:', err.message);
      }
      // If end up in catch error block then forcibly exit program
      // exit with status code 1: exiting with unsuccessful run of program
      process.exit(1);
    }
  });

// To run command from command line node index.js serve

// console.log(path.join(process.cwd(), path.dirname(filename)));
// console.log(path.basename(filename));
