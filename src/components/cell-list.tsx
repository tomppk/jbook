import { useTypedSelector } from '../hooks/use-typed-selector';
import React from 'react';
import CellListItem from './cell-list-item';

const CellList: React.FC = () => {
  // Destructure from redux state cells property and more specifically order and
  // data properties of cells.
  // Map over order array and for each 'id' return the cell with that id as key
  // from data object
  const cells = useTypedSelector(({ cells: { order, data } }) => {
    return order.map((id) => {
      return data[id];
    });
  });

  // Map over all the cell objects and for each cell create a CellListItem
  // component and pass that cell down as props
  // Always add key prop for list items
  const renderedCells = cells.map((cell) => (
    <CellListItem key={cell.id} cell={cell} />
  ));

  return <div>{renderedCells}</div>;
};

export default CellList;
