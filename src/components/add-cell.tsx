import './styles/add-cell.css';
import { useActions } from '../hooks/use-actions';

// AddCell needs to get as props the 'id' of cell we want to insert new cell before.
interface AddCellProps {
  nextCellId: string | null;
}

const AddCell: React.FC<AddCellProps> = ({ nextCellId }) => {
  // Extract insertCellBefore() action from useActions() which contains
  // all actions bound to dispatch. So they can be dispatched directly
  // inside React Component
  const { insertCellBefore } = useActions();

  // inserCellBefore(id, cellType)
  return (
    <div className="add-cell">
      <div className="add-buttons">
        <button
          className="button is-rounded is-primary is-small"
          onClick={() => insertCellBefore(nextCellId, 'code')}>
          <span className="icon is-small">
            <i className="fas fa-plus" />
          </span>
          <span>Code</span>
        </button>
        <button
          className="button is-rounded is-primary is-small"
          onClick={() => insertCellBefore(nextCellId, 'text')}>
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
