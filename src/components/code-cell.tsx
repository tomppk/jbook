import { useState, useEffect } from 'react';
import CodeEditor from './code-editor';
import Preview from './preview';
import bundle from '../bundler';
import Resizable from './resizable';

// Component to display one code editor and one preview window
const CodeCell = () => {
  // Piece of state for code content inside editor
  const [code, setCode] = useState('');

  // Piece of state for errors
  const [err, setErr] = useState('');

  // input is code that user writes into textarea
  const [input, setInput] = useState('');

  // Run useEffect whenever input changes
  // Use debouncing to limit the frequency of preview display refresh and code
  // bundling to 1s
  // Pass in the code that user has inputted inside editor to bundler component
  // bundler initializes ESbuild takes in input, bundles it and returns object
  // with bundled code and possible error. Output is set to code piece of state
  // and error piece of state
  useEffect(() => {
    const timer = setTimeout(async () => {
      const output = await bundle(input);
      setCode(output.code);
      setErr(output.err);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [input]);

  // Pass down code state to Preview component
  // Wrap content with Resizable components to enable editor and preview resizing
  return (
    <Resizable direction="vertical">
      <div style={{ height: '100%', display: 'flex', flexDirection: 'row' }}>
        <Resizable direction="horizontal">
          <CodeEditor
            initialValue="const a = 1;"
            onChange={(value) => setInput(value)}
          />
        </Resizable>
        <Preview code={code} err={err} />
      </div>
    </Resizable>
  );
};

export default CodeCell;
