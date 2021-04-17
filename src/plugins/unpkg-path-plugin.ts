import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import localForage from 'localforage';

// Create a new object to interact with an instance of browser built-in
// storage database indexedDB.
// Inside config object enter name for database we want to create
const fileCache = localForage.createInstance({
  name: 'filecache',
});

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
        }

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
        if (args.path.includes('./') || args.path.includes('../')) {
          return {
            namespace: 'a',
            path: new URL(
              args.path,
              'https://unpkg.com' + args.resolveDir + '/'
            ).href,
          };
        }

        // If args.path other than 'index.js' we assume that it is the name of
        // the package we want to fetch from unpkg.com api and use it to create
        // url path
        return {
          namespace: 'a',
          path: `https://unpkg.com/${args.path}`,
        };
      });

      // onLoad is called when ESbuild is trying to fetch the contents of a file
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
              import React, {useState} from 'react';
              console.log(React, useState);
            `,
          };
        }
        // Check to see if we have already fetched this file and if it is
        // in the cache. If not fetched will get null or undefined.
        // Add correct type so Typescript knows what type the result should be
        // and so it will not give error of unknown type
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        );

        // If it is, return it immediately.
        // Otherwise allow the request to occur below.
        if (cachedResult) {
          return cachedResult;
        }

        // Make GET request to unpkg.com and extract data property from response
        // Return object with structure ESbuild can understand so loader to determine
        // type of data or code and contents.
        // resolveDir or resolveDirectory is going to provided to the next file
        // we are going to require or import. It is going to describe the path
        // where we found earlier file eg. 'nested-test-pkg'
        // We get the path by creating a new URL object and accessing its
        // pathname property.
        // We get the rootURL for earlier file from request.responseURL property
        // './' is added to get path "/nested-test-pkg@1.0.0/src/"
        // if not added then we get ""..src/index.js"

        const { data, request } = await axios.get(args.path);
        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents: data,
          resolveDir: new URL('./', request.responseURL).pathname,
        };

        // Store response in cache
        // As key set args.path and value set result object
        await fileCache.setItem(args.path, result);

        return result;
      });
    },
  };
};
