import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import localForage from 'localforage';

// Create a new object to interact with an instance of browser built-in
// storage database indexedDB.
// Inside config object enter name for database we want to create
const fileCache = localForage.createInstance({
  name: 'filecache',
});

export const fetchPlugin = (inputCode: string) => {
  return {
    name: 'fetch-plugin',
    setup(build: esbuild.PluginBuild) {
      // onLoad is called when ESbuild is trying to fetch the contents of a file
      // event handler to listen for onLoad event of build process
      // overrides esbuilds default way of loading up a file which is to read it
      // from a file system
      // Instead do not load up the file from file system but receive it as an
      // object that has the contents of the file esbuild was trying to load

      // onLoad() function is only going to run for file that matches the filter
      // regular expression so for file that is named exactly index.js

      // If esbuild tries to load index.js file do not let it do it and load
      // up something from file system but instead it is loaded here already
      // inside object
      // loader property: 'jsx' informs ESbuild that contents might include
      // 'jsx' and it knows then to parse it properly
      build.onLoad({ filter: /(^index\.js$)/ }, () => {
        return {
          loader: 'jsx',
          contents: inputCode,
        };
      });

      // onLoad to check for all files if we already have retrieved that file.
      // If we have then return that file. No need to continue below to other
      // onLoad functions as we already have the file.
      // If we do not have a cached result then move to other onLoads to fetch
      // .css and .js and other files
      build.onLoad({ filter: /.*/ }, async (args: any) => {
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
      });

      // Use this onLoad for file ending in .css
      build.onLoad({ filter: /.css$/ }, async (args: any) => {
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

        // To prevent CSS file content such as '' to escape our contents template
        // string early we replace newlines, "" and ''
        // Use regular expressions
        // Remove all newlines, escape all double quotes and single quotes.
        const escaped = data
          .replace(/\n/g, '')
          .replace(/"/g, '\\"')
          .replace(/'/g, "\\'");

        // ESbuild cannot directly bundle .css inside a browser. It gives an error
        // of missing output file where to store the retrieved .css contents as by
        // default it expects to be working in a file system instead of browser.
        // A workaround for this is to use Javascript to create a DOM HTML element
        // and then insert the contents of the .css file inside the DOM element
        // and then append this element into document.head to render it on screen.
        const contents = `
          const style = document.createElement('style');
          style.innerText = '${escaped}';
          document.head.appendChild(style);
        `;

        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents: contents,
          resolveDir: new URL('./', request.responseURL).pathname,
        };

        // Store response in cache
        // As key set args.path and value set result object
        await fileCache.setItem(args.path, result);

        return result;
      });

      // Handle any kind of arbitrary file
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        const { data, request } = await axios.get(args.path);

        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents: data,
          resolveDir: new URL('./', request.responseURL).pathname,
        };

        await fileCache.setItem(args.path, result);

        return result;
      });
    },
  };
};
