import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';
import { ActionType } from './action-types';

// Create redux store
// Pass in our combined reducers, empty object for initial state,
// apply redux-thunk middleware for async actions
export const store = createStore(reducers, {}, applyMiddleware(thunk));

// Test redux store manually by manually dispatching action and then getting state
store.dispatch({
  type: ActionType.INSERT_CELL_BEFORE,
  payload: {
    id: null,
    type: 'code',
  },
});

store.dispatch({
  type: ActionType.INSERT_CELL_BEFORE,
  payload: {
    id: null,
    type: 'text',
  },
});

console.log(store.getState());

const id = store.getState().cells.order[0];
const idTwo = store.getState().cells.order[1];

store.dispatch({
  type: ActionType.UPDATE_CELL,
  payload: {
    id: id,
    content: 'console.log("hello world");',
  },
});

store.dispatch({
  type: ActionType.MOVE_CELL,
  payload: {
    id: idTwo,
    direction: 'up',
  },
});

store.dispatch({
  type: ActionType.DELETE_CELL,
  payload: id,
});

console.log(store.getState());
