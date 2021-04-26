import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';
import { persistMiddleware } from './middlewares/persist-middleware';

// Create redux store
// Pass in our combined reducers, empty object for initial state,
// apply persistMiddleware to save cells when they have changed
// apply redux-thunk middleware for async actions
export const store = createStore(
  reducers,
  {},
  applyMiddleware(persistMiddleware, thunk)
);
