import * as esbuild from 'esbuild-wasm';
import { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';

// <pre> element formats code nicely and makes it look like code
const App = () => {
  // Initialize useRef hook with type
  // Ref can be a reference to any javascript value inside a component, not only
  // a reference to HTML DOM element. We will use ref.current to hold a reference
  // to esbuild service object to access esbuild functionality inside our component
  const ref = useRef<any>();

  // input is code that user writes into textarea
  // code is output from ESbuild tool, so transpiled and bundled codo that user
  //inputs. Show this code output in <pre> element
  const [input, setInput] = useState('');
  const [code, setCode] = useState('');

  // Initialize esbuild service with config object.
  // wasmURL is path to esbuild webassembly binary in our public folder
  // startService returns esbuild object with functions to transpile and bundle
  // code
  // Assign
  const startService = async () => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: '/esbuild.wasm',
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
      plugins: [unpkgPathPlugin(input)],
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window',
      },
    });
    // console.log(result);

    setCode(result.outputFiles[0].text);
  };

  return (
    <div>
      <textarea value={input} onChange={onChange}></textarea>
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <pre>{code}</pre>
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector('#root'));
