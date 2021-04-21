import produce from 'immer';
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
// Reducers always return new state object, not modify previous state object to
// prevent accidentally referencing the old object

// Wrap our reducer with Immer produce method to create new state more easily
// Immer allows to make direct updates to state and produces new state based
// on those updates
const reducer = produce((state: CellsState = initialState, action: Action) => {
  switch (action.type) {
    case ActionType.UPDATE_CELL:
      const { id, content } = action.payload;
      // Immer allows to directly modify state object and automatically returns
      // new state object
      // Find cell with id we want to update from previous redux state and
      // update its content property with new content from action.payload
      // Add return; not to fall through to other cases but stop here.
      state.data[id].content = content;
      return;

    case ActionType.DELETE_CELL:
      return state;
    case ActionType.MOVE_CELL:
      return state;
    case ActionType.INSERT_CELL_BEFORE:
      return state;
    default:
      return state;
  }
});

export default reducer;
