import express from 'express';

export const serve = (port: number, filename: string, dir: string) => {
  const app = express();

  // Wrap starting express server listening inside a custom Promise to enable
  // async error handling in CLI.
  // The Promise will be resolved or rejected at some point in time.
  // If we successfully start up our server and start listening then resolve
  // function will be called automatically which resolves the Promise.
  // If something goes wrong with starting express server reject function is
  // called. That will reject Promise and put it in error state which will in
  // turn throw an error at CLI serve command try/catch block.
  return new Promise<void>((resolve, reject) => {
    app.listen(port, resolve).on('error', reject);
  });
};
