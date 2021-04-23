import { useTypedSelector } from './use-typed-selector';

// Cumulated code for the current cell + all the previous cells
// Reach into cells piece of state in redux store and pull out
// data, order properties.
// Map over order and produce ordered array of all the cells we have
// including both code and text cells.
// Add the content of code cells into cumulativeCode array
// If the 'id' of the cell we are currently iterating over matches the id
// of our current CodeCell component, break early.
export const useCumulativeCode = (cellId: string) => {
  return useTypedSelector((state) => {
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
    const showFunc = `
        import _React from 'react';
        import _ReactDOM from 'react-dom';
        var show = (value) => {
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
      `;

    // Show() with no operation. It does nothing when called.
    // Use var to declare show. Var can be used to declare same variable many
    // times
    const showFuncNoop = 'var show = () => {}';
    const cumulativeCode = [];

    // Only add working show() function to current cell to prevent rendering
    // content to other cells' preview displays.
    for (let c of orderedCells) {
      if (c.type === 'code') {
        if (c.id === cellId) {
          cumulativeCode.push(showFunc);
        } else {
          cumulativeCode.push(showFuncNoop);
        }
        cumulativeCode.push(c.content);
      }

      if (c.id === cellId) {
        break;
      }
    }
    return cumulativeCode;
    // Join cumulativeCode array of code strings together using newline as
    // separator, so adds newline after every code string.
    // Returns a joined string like "console.log('hi')\nconsole.log('there')"
  }).join('\n');
};
