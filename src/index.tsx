import ReactDOM from 'react-dom';
import { useState } from 'react';

// <pre> element formats code nicely and makes it look like code
const App = () => {
  // input is code that user writes into textarea
  // code is output from ESbuild tool, so transpiled and bundled codo that user
  //inputs. Show this code output in <pre> element
  const [input, setInput] = useState('');
  const [code, setCode] = useState('');

  // Set input to be the value of keypress inside text field
  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setInput(event.target.value);
  };

  const onClick = () => {
    console.log(input);
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
