import * as esbuild from 'esbuild-wasm';
import axios from 'axios';

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
      // onResolve is called whenever ESbuild is trying to figure out a path
      // to a particular module.
      // event hanlder to listen for onResolve event of build process
      // overrides the default process of esbuild of figuring out where to find
      // file
      // filter: regular expression controls when onResolve and onLoad are
      // executed. filter applied against the filename we are going to load.
      // namespace: is used to flag files we want onResolve and onLoad to be
      // applied to. Can have many files with different namespaces
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        console.log('onResolve', args);
        if (args.path === 'index.js') {
          return { path: args.path, namespace: 'a' };
        } else if (args.path === 'tiny-test-pkg') {
          return {
            path: 'https://unpkg.com/tiny-test-pkg@1.0.0/index.js',
            namespace: 'a',
          };
        }
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
        // loader property: 'jsx' informs ESbuild that contents might include
        // 'jsx' and it knows then to parse it properly
        if (args.path === 'index.js') {
          return {
            loader: 'jsx',
            contents: `
              const message = require('tiny-test-pkg');
              console.log(message);
            `,
          };
        }
        // Make GET request to unpkg.com and extract data property from response
        // Return object with structure ESbuild can understand so loader to determine
        // type of data or code and contents
        const { data } = await axios.get(args.path);
        return {
          loader: 'jsx',
          contents: data,
        };
      });
    },
  };
};
