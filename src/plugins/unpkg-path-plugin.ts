import * as esbuild from 'esbuild-wasm';

// A plugin that works inside ESbuild
// Similar plugins can be applied to other module bundlers as well like Webpack
// This plugin intercepts esbuild when it tries to look for module inside local
// filesystem or node_modules folder
// We instead look to unpkg.com that hosts all source code for npm packages and
// retrieve the main index.js file of needed package
export const unpkgPathPlugin = () => {
  return {
    // name property is for debugging purpose if have multiple plugins
    // setup function called automatically
    name: 'unpkg-path-plugin',
    setup(build: esbuild.PluginBuild) {
      // event hanlder to listen for onResolve event of build process
      // overrides the default process of esbuild of figuring out where to find
      // file
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        console.log('onResole', args);
        return { path: args.path, namespace: 'a' };
      });
      // event handler to listen for onLoad event of build process
      // overrides esbuilds default way of loading up a file which is to read it
      // from a file system
      // Instead do not load up the file from file system but receive it as an
      // object that has the contents of the file esbuild was trying to load
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        console.log('onLoad', args);

        // If esbuild tries to load index.js file do not let it do it and load
        // up something from file system but instead it is loaded here already
        // inside object
        if (args.path === 'index.js') {
          return {
            loader: 'jsx',
            contents: `
              import message from './message';
              console.log(message);
            `,
          };
        } else {
          return {
            loader: 'jsx',
            contents: 'export default "hi there!"',
          };
        }
      });
    },
  };
};
