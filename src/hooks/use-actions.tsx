// Helper hook to automatically bind action creators to dispatch. Makes the
// process of dispatching actions easier.

import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../redux';

// Bind actionCreators to dispatch. This automatically dispatches actions
// when action creator is called ie.
// const { updateCell } = useActions();
// updateCell(arguments);
export const useActions = () => {
  const dispatch = useDispatch();

  return bindActionCreators(actionCreators, dispatch);
};
