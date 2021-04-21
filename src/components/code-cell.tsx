import { useState, useEffect } from 'react';
import CodeEditor from './code-editor';
import Preview from './preview';
import bundle from '../bundler';
import Resizable from './resizable';
import { Cell } from '../redux';
// Import helper hook to dispatch actions directly inside CodeCell component
import { useActions } from '../hooks/use-actions';

// Interface to define properties which the props that the parent component
// passes down into CodeCell component must satisfy
interface CodeCellProps {
  cell: Cell;
}

// Component to display one code editor and one preview window
// Destructure received props.cell
const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  // Piece of state for code content inside editor
  const [code, setCode] = useState('');

  // Piece of state for errors
  const [err, setErr] = useState('');

  // Extract updateCell action creator from useActions()
  // updateCell(id, content) takes in id of cell and content to update.
  // Dispatches action to update redux store state.
  const { updateCell } = useActions();

  // cell.content is the code that user writes into editor
  // Run useEffect whenever input changes ie. cell.content piece of state from
  // redux store
  // Use debouncing to limit the frequency of preview display refresh and code
  // bundling to 1s
  // Pass in the code that user has inputted inside editor to bundler component
  // bundler initializes ESbuild takes in input, bundles it and returns object
  // with bundled code and possible error. Output is set to code piece of state
  // and error piece of state
  useEffect(() => {
    const timer = setTimeout(async () => {
      const output = await bundle(cell.content);
      setCode(output.code);
      setErr(output.err);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [cell.content]);

  // Pass down code state to Preview component
  // Wrap content with Resizable components to enable editor and preview resizing
  // updateCell() updates the redux store state
  return (
    <Resizable direction="vertical">
      <div style={{ height: '100%', display: 'flex', flexDirection: 'row' }}>
        <Resizable direction="horizontal">
          <CodeEditor
            initialValue={cell.content}
            onChange={(value) => updateCell(cell.id, value)}
          />
        </Resizable>
        <Preview code={code} err={err} />
      </div>
    </Resizable>
  );
};

export default CodeCell;
