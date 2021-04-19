import * as esbuild from 'esbuild-wasm';
import { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { fetchPlugin } from './plugins/fetch-plugin';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
import CodeEditor from './components/code-editor';

// <pre> element formats code nicely and makes it look like code
const App = () => {
  // Initialize useRef hook with type
  // Ref can be a reference to any javascript value inside a component, not only
  // a reference to HTML DOM element. We will use ref.current to hold a reference
  // to esbuild service object to access esbuild functionality inside our component
  const ref = useRef<any>();

  // Reference to iframe element
  const iframe = useRef<any>();

  // input is code that user writes into textarea
  const [input, setInput] = useState('');

  // Initialize esbuild service with config object.
  // wasmURL is path to esbuild webassembly binary that we fetch from unpkg.com
  // startService returns esbuild object with functions to transpile and bundle
  // code
  const startService = async () => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm',
    });
  };

  // useEffect hook similar to componentDidMount class based method
  // Calls startService() once when the App component is first rendered.
  useEffect(() => {
    startService();
  }, []);

  // Set input to be the value of keypress inside text field
  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setInput(event.target.value);
  };

  // Check that there is ref.current so esbuild service has been initialized
  // Call esbuild method transform with user input which transpiles code
  // ref.current.transform() method is async so use async/await
  const onClick = async () => {
    if (!ref.current) {
      return;
    }

    // Before rendering any new code we reset the contents or srcdoc property
    // of iframe into our base html document defined below
    iframe.current.srcdoc = html;

    // TRANSPILE
    // First argument input code to be transpiled
    // Second argument config object. Loader determines type of code we expect
    // input to be so javascript with jsx.
    // Target specifies the environment or version of code generated
    // Returns result object with property code we want to display
    // const result = await ref.current.transform(input, {
    //   loader: 'jsx',
    //   target: 'es2015',
    // });

    // BUNDLE
    // First argument config object to give instructions on
    // bundling code.
    // Entrypoint defines the first file we want to be bundled
    // define: lets us replace global identifiers with constant expressions
    // so when bundling code the bundler encounters 'process.env.NODE_ENV' it is
    // replaced with a string "production" to get a string double quotes is used
    // '"string"'
    // If find variable global replace it with variable window (not string)
    // This is done as some modules or packages require global variable window to
    // function properly
    const result = await ref.current.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(input)],
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window',
      },
    });

    // result.outputFiles[0].text is the code string that user inputs in textarea
    // setCode(result.outputFiles[0].text);

    // When the code bundling process is complete we take the reference to iframe
    // and use that reference to emit or post a message down into the iframe
    // The message is the code string that user inputs in textarea
    // '*' is targetOrigin which means that target uri is any and not restricted
    iframe.current.contentWindow.postMessage(result.outputFiles[0].text, '*');
  };

  // Get our code inside iframe element so it gets executed separately
  // inside iframe with no access to outside iframe for security reasons-
  // Add basic html and div with id="root" ready for React components to use.
  // Add script with event listener that enables indirect communication between
  // parent element and child iframe
  // Event listener listens for a message from parent element that contains the
  // user inputted code as a string inside event.data
  // eval() evaluates and executes Javascript inside browser
  // Incase error display error inside root div and also inside console
  // for further investigation
  const html = `
    <html>
      <head></head>
      <body>
        <div id="root"></div>
        <script>
          window.addEventListener('message', (event) => {
            try {
              eval(event.data)
            } catch (err) {
              const root = document.querySelector('#root');
              root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + err + '</div>'
              console.error(err);
            }
          }, false);
        </script>
      </body>
    </html>
  `;

  // srcDoc allows us to load local string as src instead of url
  // We generate the html content ourselves instead of fetching it
  // if sandbox = "allow-same-origin" communication between parent element
  // and child iframe is possible, if this is missing then they cannot communicate.
  // If sandbox="allow-scripts" iframe can run js scripts
  return (
    <div>
      <CodeEditor />
      <textarea value={input} onChange={onChange}></textarea>
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <iframe
        title="preview"
        ref={iframe}
        srcDoc={html}
        sandbox="allow-scripts"
      />
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector('#root'));
