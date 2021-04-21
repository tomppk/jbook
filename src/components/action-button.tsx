import { Action } from '../redux';

// Define props structure, onClick must return a defined Action type
interface ActionButtonProps {
  onClick: () => Action;
  icon: string;
}

// Button component takes in callback to execute when clicked and fontawesome class icon name eg.
const ActionButton: React.FC<ActionButtonProps> = ({ onClick, icon }) => {
  return (
    <button className="button is-primary is-small" onClick={onClick}>
      <span className="icon">
        <i className={`fas ${icon}`}></i>
      </span>
    </button>
  );
};

export default ActionButton;
