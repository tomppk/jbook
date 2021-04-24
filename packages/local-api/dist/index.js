"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serve = void 0;
var express_1 = __importDefault(require("express"));
var http_proxy_middleware_1 = require("http-proxy-middleware");
var path_1 = __importDefault(require("path"));
var cells_1 = require("./routes/cells");
var serve = function (port, filename, dir, useProxy) {
    var app = express_1.default();
    // Wire up and create express router with our routes and pass in file and dir
    // Have this line before useProxy so we can check if request matches our routes
    // If there is no match, only then fall through to proxy middleware
    app.use(cells_1.createCellsRouter(filename, dir));
    // useProxy checks if we are doing local development or running on
    // a user's machine.
    // This way of serving React assets is intended when we are running in
    // development mode and we have create-react-app dev server running.
    // So we redirect or proxy requests over to a running React dev server.
    // Create proxy to route incoming requests to React App at localhost:3000
    // So if we access default port 4005 with serve command we get routed to 3000
    // We are connecting to our React application through local-api. When using
    // the final app, there will not be React development server running and
    // only way to access the React App is local-api. This is why use proxy.
    // ws: enable websocket support. Create-react-app uses websocket by default
    // to tell browser that some file has changed.
    // logLevel: 'silent' disables logging to console
    if (useProxy) {
        app.use(http_proxy_middleware_1.createProxyMiddleware({
            target: 'http://localhost:3000',
            ws: true,
            logLevel: 'silent',
        }));
    }
    else {
        // For local-api to get access to production built React App assets.
        // We can serve production built files over from our local-client package
        // require.resolve is going to apply Node's path resolution algorithm to
        // figure out the absolute path on local machine to local-client folder
        // to get to index.html file
        // We do not want index.html so we call path.dirname to give us the build
        // folder where index.html is located. The path to build folder is given
        // to .static so it can make the build folder and its contents available
        // Express built-in static middleware serves up files and folders from path
        // directory. eg. all the files from './public' are accessible at
        // localhost:4005/index.html
        // This way of serving up React assets is intended when user has CLI installed
        // to local machine.
        var packagePath = require.resolve('local-client/build/index.html');
        app.use(express_1.default.static(path_1.default.dirname(packagePath)));
    }
    // Wrap starting express server listening inside a custom Promise to enable
    // async error handling in CLI.
    // The Promise will be resolved or rejected at some point in time.
    // If we successfully start up our server and start listening then resolve
    // function will be called automatically which resolves the Promise.
    // If something goes wrong with starting express server reject function is
    // called. That will reject Promise and put it in error state which will in
    // turn throw an error at CLI serve command try/catch block.
    return new Promise(function (resolve, reject) {
        app.listen(port, resolve).on('error', reject);
    });
};
exports.serve = serve;
