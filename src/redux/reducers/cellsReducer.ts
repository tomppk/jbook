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
const reducer = (
  state: CellsState = initialState,
  action: Action
): CellsState => {
  switch (action.type) {
    // ...state spread all the existing properties of previous state into
    // new state object. State structure is defined above initialState.
    // Define new data property for new state that has all the existing cells
    // from previous state by spreading previous ...state.data property.
    // Overwrite the cell contents of cell key or id of [action.payload.id]

    // Then find key [action.payload.id] which is the id of cell we want to update
    // New value for cell with that particular key will be the previous value
    // of the cell with that id ...state.date[action.payload.id], except overwrite
    // content property with action.payload.content
    case ActionType.UPDATE_CELL:
      const { id, content } = action.payload;

      return {
        ...state,
        data: {
          ...state.data,
          [id]: {
            ...state.data[id],
            content: content,
          },
        },
      };
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
