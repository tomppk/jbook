import * as esbuild from 'esbuild-wasm';
import { fetchPlugin } from '../plugins/fetch-plugin';
import { unpkgPathPlugin } from '../plugins/unpkg-path-plugin';

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

  const result = await service.build({
    entryPoints: ['index.js'],
    bundle: true,
    write: false,
    plugins: [unpkgPathPlugin(), fetchPlugin(rawCode)],
    define: {
      'process.env.NODE_ENV': '"production"',
      global: 'window',
    },
  });

  // result.outputFiles[0].text is the code string that user inputs in editor
  return result.outputFiles[0].text;
};

export default bundle;
