import * as esbuild from 'esbuild-wasm';
import { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

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

  //
  const onClick = (): void => {
    if (!ref.current) {
      return;
    }

    console.log(ref.current);
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
