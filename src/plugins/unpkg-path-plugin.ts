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
      // onResolve is called whenever ESbuild is trying to figure out a path
      // to a particular module.
      // event hanlder to listen for onResolve event of build process
      // overrides the default process of esbuild of figuring out where to find
      // file
      // filter: regular expression controls when onResolve and onLoad are
      // executed. filter applied against the filename we are going to load.
      // namespace: is used to flag files we want onResolve and onLoad to be
      // applied to. Can have many files with different namespaces

      // Filter to look for file that is exactly index.js written in regular
      // expression. When find that file run callback function
      // Handle root entry file of 'index.js'
      build.onResolve({ filter: /(^index\.js$)/ }, () => {
        return { path: 'index.js', namespace: 'a' };
      });

      // Filter to check if the filepath we are looking for is a relative path
      // ie. like ./ or ../
      // Handle relative paths in a module

      // args.path eg. 'index.js' or relative path './utils' '../utils' etc.
      // If args.path includes relative path we use special URL constructor
      // for browsers to create a url path where to retrieve package
      // Create a new URL object and access its href property which is the whole
      // combine URL
      // First argument path we want to add to root url
      // Second argument root url we want to add the first argument to
      // We get the root url from args.resolveDir property which is the filepath
      // or url where ESbuild found earlier file eg. index.js
      // "https://unpkg.com/medium-test-pkg/src/helpers" where we add /utils

      // If args.path other than 'index.js' we assume that it is the name of
      // the package we want to fetch from unpkg.com api and use it to create
      // url path

      build.onResolve({ filter: /^\.+\// }, (args: any) => {
        return {
          namespace: 'a',
          path: new URL(args.path, 'https://unpkg.com' + args.resolveDir + '/')
            .href,
        };
      });

      // Handle main file of a module
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        return {
          namespace: 'a',
          path: `https://unpkg.com/${args.path}`,
        };
      });
    },
  };
};
