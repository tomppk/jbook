import { useState } from 'react';
import CodeEditor from './code-editor';
import Preview from './preview';
import bundle from '../bundler';
import Resizable from './resizable';

// Component to display one code editor and one preview window
const CodeCell = () => {
  // Piece of state for code content inside editor
  const [code, setCode] = useState('');

  // input is code that user writes into textarea
  const [input, setInput] = useState('');

  // Pass in the code that user has inputted inside editor to bundler component
  // bundler initializes ESbuild takes in input, bundles it and returns bundled
  // code. This output is then set to code piece of state
  const onClick = async () => {
    const output = await bundle(input);
    setCode(output);
  };

  // Pass down code state to Preview component
  return (
    <Resizable direction="vertical">
      <div style={{ height: '100%', display: 'flex', flexDirection: 'row' }}>
        <CodeEditor
          initialValue="const a = 1;"
          onChange={(value) => setInput(value)}
        />
        <Preview code={code} />
      </div>
    </Resizable>
  );
};

export default CodeCell;
