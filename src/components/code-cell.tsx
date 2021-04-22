import './styles/code-cell.css';
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

  // Cumulated code for the current cell + all the previous cells
  // Reach into cells piece of state in redux store and pull out
  // data, order properties.
  // Map over order and produce ordered array of all the cells we have
  // including both code and text cells.
  // Add the content of code cells into cumulativeCode array
  // If the 'id' of the cell we are currently iterating over matches the id
  // of our current CodeCell component, break early.
  const cumulativeCode = useTypedSelector((state) => {
    const { data, order } = state.cells;
    const orderedCells = order.map((id) => data[id]);

    // Manually add show() function with template string to be the first
    // code string in cumulativeCode array.
    // show() displays its parameters inside preview display
    // If value is object then convert that object into JSON string
    // If value has $$typeof and props properties then it is a React JSX element
    // and it needs to be rendered differently. To get this to work code cell
    // must import both React and ReactDOM. To avoid naming collisions when user
    // imports React and ReactDOM we name these with underscore and change
    // ESBuild configuration to use _React.createElement instead to render
    // JSX element when using show() function
    const cumulativeCode = [
      `
      import _React from 'react';
      import _ReactDOM from 'react-dom';
      const show = (value) => {
        const root = document.querySelector('#root');

        if (typeof value === 'object') {
          if (value.$$typeof && value.props) {
            _ReactDOM.render(value, root)
          } else {
            root.innerHTML = JSON.stringify(value);
          } 
        } else {
          root.innerHTML = value;
      }
    }
    `,
    ];

    for (let c of orderedCells) {
      if (c.type === 'code') {
        cumulativeCode.push(c.content);
      }

      if (c.id === cell.id) {
        break;
      }
    }
    return cumulativeCode;
  });

  // cell.content is the code that user writes into editor
  // Run useEffect whenever input changes ie. cell.content piece of state from
  // redux store
  // Use debouncing to limit the frequency of preview display refresh and code
  // bundling to 1s
  // Pass in the code that user has inputted inside editor to createBundle()
  // action creator.
  // createBundle() action creator calls bundler to bundle input code
  // and updates redux store state
  // bundler initializes ESbuild takes in input, bundles it and returns object
  // with bundled code and possible error.
  useEffect(() => {
    // If there is no bundle, then do not wait 750ms but bundle code instantly
    // This runs bundle immediately at app initialization
    // After following re-renderings add 750ms delay
    // Join cumulativeCode array of code strings together using newline as
    // separator, so adds newline after every code string
    if (!bundle) {
      createBundle(cell.id, cumulativeCode.join('\n'));
      return;
    }

    const timer = setTimeout(async () => {
      createBundle(cell.id, cumulativeCode.join('\n'));
    }, 750);

    return () => {
      clearTimeout(timer);
    };
    // Disable eslint so it does not give error of missing dependency of 'bundle'
    // below inside depencies list. If we would add 'bundle' it would cause
    // useEffect() to enter into infinite loop

    // Disable eslint for next line below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cumulativeCode.join('\n'), cell.content, createBundle]);

  // Pass down code state to Preview component
  // Wrap content with Resizable components to enable editor and preview resizing
  // updateCell() updates the redux store state
  // Set height to be 100% of parent less 10px for the resizer handle bar. This
  // way the resizer handle bar fits into parent as well and does not get pushed
  // out
  // If there is no bundle or bundle.loading then display <progress> bar HTML
  // element with classNames from Bulma to add it styling.
  // Add custom CSS to class "progress-cover" to show and position progress bar
  // correctly
  // Otherwise display <Preview> component
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
        <div className="progress-wrapper">
          {!bundle || bundle.loading ? (
            <div className="progress-cover">
              <progress className="progress is-small is-primary" max="100">
                Loading
              </progress>
            </div>
          ) : (
            <Preview code={bundle.code} err={bundle.err} />
          )}
        </div>
      </div>
    </Resizable>
  );
};

export default CodeCell;
