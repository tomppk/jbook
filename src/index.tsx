import 'bulmaswatch/superhero/bulmaswatch.min.css';
import { useState } from 'react';
import ReactDOM from 'react-dom';

import CodeEditor from './components/code-editor';
import Preview from './components/preview';
import bundle from './bundler';

// <pre> element formats code nicely and makes it look like code
const App = () => {
  // Piece of state for code content inside editor
  const [code, setCode] = useState('');

  // input is code that user writes into textarea
  const [input, setInput] = useState('');

  // Set input to be the value of keypress inside text field
  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setInput(event.target.value);
  };

  // Pass in the code that user has inputted inside editor to bundler component
  // bundler initializes ESbuild takes in input, bundles it and returns bundled
  // code. This output is then set to code piece of state
  const onClick = async () => {
    const output = await bundle(input);
    setCode(output);
  };

  // Pass down code state to Preview component
  return (
    <div>
      <CodeEditor
        initialValue="const a = 1;"
        onChange={(value) => setInput(value)}
      />
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <Preview code={code} />
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector('#root'));
