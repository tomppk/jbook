import { ActionType } from '../action-types';
import { Action } from '../actions';
import { Cell } from '../cell';

// Interface to define exact output of this reducer
// Data is object with key cell id and value the actual Cell
interface CellsState {
  loading: boolean;
  error: string | null;
  order: string[];
  data: {
    [key: string]: Cell;
  };
}

// Define initial state that this reducer outputs to redux store on initialization
const initialState: CellsState = {
  loading: false,
  error: null,
  order: [],
  data: {},
};

// Define the actual reducer with arguments state with default value of
// initialState and action. Return value satisfies CellsState interface
const reducer = (
  state: CellsState = initialState,
  action: Action
): CellsState => {
  switch (action.type) {
    case ActionType.UPDATE_CELL:
      return state;
    case ActionType.DELETE_CELL:
      return state;
    case ActionType.MOVE_CELL:
      return state;
    case ActionType.INSERT_CELL_BEFORE:
      return state;
    default:
      return state;
  }
};

export default reducer;
