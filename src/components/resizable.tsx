import { ResizableBox, ResizableBoxProps } from 'react-resizable';
import { useEffect, useState } from 'react';
import './resizable.css';

// Interface to define required props for the component
interface ResizableProps {
  direction: 'horizontal' | 'vertical';
}

// Extract direction and children.
// We always receive children props if we try to place some content or another
// React component inside this component as props
// By wrapping children with this component we can make them resizable.
// Configue ResizableBox properties according to npm documentation
// width Infinity is same as 100% so as much space as possible
// resizeHandles takes array with directions like south on which side to display
// handles
// maxConstraints array to limit resizing [horizontal, vertical]
// vertical set to max 90% of browser window height, with min 24px
const Resizable: React.FC<ResizableProps> = ({ direction, children }) => {
  let resizableProps: ResizableBoxProps;
  const [innerHeight, setInnerHeight] = useState(window.innerHeight);
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);

  // When component rendered add event listener to window to listen for browser
  // window resize event and then call listener callback.
  // When component no longer rendered or re-rendered perform cleanup and remove
  // event listener
  // When window size changes set new height and width values to state
  // Use technique called debouncing with setTimeout to limit the frequency of
  // resizing to once per 100ms
  useEffect(() => {
    let timer: any;

    const listener = () => {
      if (timer) {
        clearTimeout(timer);
      }

      timer = setTimeout(() => {
        setInnerHeight(window.innerHeight);
        setInnerWidth(window.innerWidth);
      }, 100);
    };
    window.addEventListener('resize', listener);

    return () => {
      window.removeEventListener('resize', listener);
    };
  }, []);

  if (direction === 'horizontal') {
    resizableProps = {
      className: 'resize-horizontal',
      minConstraints: [innerWidth * 0.2, Infinity],
      maxConstraints: [innerWidth * 0.75, Infinity],
      height: Infinity,
      width: innerWidth * 0.75,
      resizeHandles: ['e'],
    };
  } else {
    resizableProps = {
      minConstraints: [Infinity, 24],
      maxConstraints: [Infinity, innerHeight * 0.9],
      height: 300,
      width: Infinity,
      resizeHandles: ['s'],
    };
  }

  return <ResizableBox {...resizableProps}>{children}</ResizableBox>;
};

export default Resizable;
