import './styles/add-cell.css';
import { useActions } from '../hooks/use-actions';

// AddCell needs to get as props the 'id' of cell we want to insert new cell
// after. ForceVisible is optional so we do not provide it to every instance
// of AddCell component. Only if there are no other cells on screen
interface AddCellProps {
  previousCellId: string | null;
  forceVisible?: boolean;
}

const AddCell: React.FC<AddCellProps> = ({ forceVisible, previousCellId }) => {
  // Extract insertCellAfter() action from useActions() which contains
  // all actions bound to dispatch. So they can be dispatched directly
  // inside React Component
  const { insertCellAfter } = useActions();

  // inserCellAfter(id, cellType)
  // If forceVisible is true then add another className of "force-visible"
  // to set opacity to 1 and force the component to show on screen
  return (
    <div className={`add-cell ${forceVisible && 'force-visible'}`}>
      <div className="add-buttons">
        <button
          className="button is-rounded is-primary is-small"
          onClick={() => insertCellAfter(previousCellId, 'code')}>
          <span className="icon is-small">
            <i className="fas fa-plus" />
          </span>
          <span>Code</span>
        </button>
        <button
          className="button is-rounded is-primary is-small"
          onClick={() => insertCellAfter(previousCellId, 'text')}>
          <span className="icon is-small">
            <i className="fas fa-plus" />
          </span>
          <span>Text</span>
        </button>
      </div>
      <div className="divider"></div>
    </div>
  );
};

export default AddCell;
