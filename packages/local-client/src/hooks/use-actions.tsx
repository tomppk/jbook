// Helper hook to automatically bind action creators to dispatch. Makes the
// process of dispatching actions easier.

// useMemo can be used to bind action creator only once
import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../redux';

// Bind actionCreators to dispatch. This automatically dispatches actions
// when action creator is called ie.
// const { updateCell } = useActions();
// updateCell(arguments);
export const useActions = () => {
  const dispatch = useDispatch();

  // useMemo is almost like useEffect and useState put together
  // Whenever [dispatch] changes React is going to rerun callback function
  // So in this case it means we are only going to bind our action creators
  // one single time.
  // This is done so that inside CodeCell component createBundle() function will
  // be a stable function. No matter how many times we call useActions() we will
  // always get back same createBundle() in memory.
  // Because of this React will no longer think that createBundle is changing and
  // call useEffect() again every 750ms which causes CodeCell component to
  // re-render every 750ms causing our Preview windows to flash and blink
  return useMemo(() => {
    return bindActionCreators(actionCreators, dispatch);
  }, [dispatch]);
};
