import React from 'react';
import { Cell } from '../redux/';
import CodeCell from './code-cell';
import TextEditor from './text-editor';
import ActionBar from './action-bar';
import './styles/cell-list-item.css';

interface CellListItemProps {
  cell: Cell;
}

// child <> wrapped in React Fragment that will not be rendered to DOM
// Fragment is used so that we can add many different elements inside it but
// we do not need to use <div> to wrap around our nested elements. This might
// cause elements not to display correctly
// Add <ActionBar> after TextEditor to display Action bar element on top
const CellListItem: React.FC<CellListItemProps> = ({ cell }) => {
  let child: JSX.Element;
  if (cell.type === 'code') {
    child = (
      <>
        <div className="action-bar-wrapper">
          <ActionBar id={cell.id} />
        </div>
        <CodeCell cell={cell} />
      </>
    );
  } else {
    child = (
      <>
        <TextEditor cell={cell} />
        <ActionBar id={cell.id} />
      </>
    );
  }

  return <div className="cell-list-item">{child}</div>;
};

export default CellListItem;
