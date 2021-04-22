import { useEffect } from 'react';
import CodeEditor from './code-editor';
import Preview from './preview';
import Resizable from './resizable';
import { Cell } from '../redux';
// Import helper hook to dispatch actions directly inside CodeCell component
import { useActions } from '../hooks/use-actions';
// Import typed helper hook to allow CodeCell component to directly
// pull state data from inside our redux store
import { useTypedSelector } from '../hooks/use-typed-selector';

// Interface to define properties which the props that the parent component
// passes down into CodeCell component must satisfy
interface CodeCellProps {
  cell: Cell;
}

// Component to display one code editor and one preview window
// Destructure received props.cell
const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  // Extract updateCell and createBundle action creators from useActions()
  // updateCell(id, content) takes in id of cell and content to update.
  // Dispatches action to update redux store state.
  const { updateCell, createBundle } = useActions();

  // Reach into redux store and find the bundled state of cell with
  // specified 'id'
  const bundle = useTypedSelector((state) => state.bundles[cell.id]);

  // cell.content is the code that user writes into editor
  // Run useEffect whenever input changes ie. cell.content piece of state from
  // redux store
  // Use debouncing to limit the frequency of preview display refresh and code
  // bundling to 1s
  // Pass in the code that user has inputted inside editor to createBundle()
  // action creator.
  // bundler initializes ESbuild takes in input, bundles it and returns object
  // with bundled code and possible error. Output is set to code piece of state
  // and error piece of state
  useEffect(() => {
    const timer = setTimeout(async () => {
      createBundle(cell.id, cell.content);
    }, 750);

    return () => {
      clearTimeout(timer);
    };
  }, [cell.id, cell.content]);

  // Pass down code state to Preview component
  // Wrap content with Resizable components to enable editor and preview resizing
  // updateCell() updates the redux store state
  // Set height to be 100% of parent less 10px for the resizer handle bar. This
  // way the resizer handle bar fits into parent as well and does not get pushed
  // out
  // Do not show <Preview> if bundle is not yet defined
  return (
    <Resizable direction="vertical">
      <div
        style={{
          height: 'calc(100% - 10px)',
          display: 'flex',
          flexDirection: 'row',
        }}>
        <Resizable direction="horizontal">
          <CodeEditor
            initialValue={cell.content}
            onChange={(value) => updateCell(cell.id, value)}
          />
        </Resizable>
        {bundle && <Preview code={bundle.code} err={bundle.err} />}
      </div>
    </Resizable>
  );
};

export default CodeCell;
