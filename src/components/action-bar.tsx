import { useActions } from '../hooks/use-actions';
import ActionButton from './action-button';

// Get id of cell as props
interface ActionBarProps {
  id: string;
}

const ActionBar: React.FC<ActionBarProps> = ({ id }) => {
  // Extract moveCell and deleteCell actioncreators to dispatch those actions
  const { moveCell, deleteCell } = useActions();

  // Use fontawesome css classes to add styled icons to buttons
  // When button is clicked execute callback and dispatch action to move or delete cell
  return (
    <div className="action-bar">
      <ActionButton onClick={() => moveCell(id, 'up')} icon="fa-arrow-up" />
      <ActionButton onClick={() => moveCell(id, 'down')} icon="fa-arrow-down" />
      <ActionButton onClick={() => deleteCell(id)} icon="fa-times" />
    </div>
  );
};

export default ActionBar;
