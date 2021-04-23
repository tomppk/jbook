import * as esbuild from 'esbuild-wasm';
import { fetchPlugin } from './plugins/fetch-plugin';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';

// ESbuild service needs to be initialized and started only once
// Below we check if service is not yet initialized then we initialize it
let service: esbuild.Service;

// Wrap up all the logic around ESbuild
// Receive code, bundle it and export it
// export const Bundle = async (rawCode: string) => {

const bundle = async (rawCode: string) => {
  // Initialize esbuild service with config object.
  // wasmURL is path to esbuild webassembly binary that we fetch from unpkg.com
  // startService returns esbuild object with functions to transpile and bundle
  // code
  if (!service) {
    service = await esbuild.startService({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm',
    });
  }

  // Change settings to use _React variable to render JSX elements in
  // preview display
  // This is done to enable show() function to render JSX into preview window
  // without the user needing to import React. So we import React
  // library automatically for user as _React variable.
  // Underscore is added to prevent naming collisions if user also imports React.
  // ESBuild will bundle React library only once so user does not need to import
  // it
  try {
    const result = await service.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(rawCode)],
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window',
      },
      jsxFactory: '_React.createElement',
      jsxFragment: '_React.Fragment',
    });

    // result.outputFiles[0].text is the code string that user inputs in editor
    return {
      code: result.outputFiles[0].text,
      err: '',
    };
  } catch (err) {
    return {
      code: '',
      err: err.message,
    };
  }
};

export default bundle;
