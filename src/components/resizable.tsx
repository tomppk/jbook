import { ResizableBox, ResizableBoxProps } from 'react-resizable';
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

  if (direction === 'horizontal') {
    resizableProps = {
      className: 'resize-horizontal',
      minConstraints: [window.innerWidth * 0.2, Infinity],
      maxConstraints: [window.innerWidth * 0.75, Infinity],
      height: Infinity,
      width: window.innerWidth * 0.75,
      resizeHandles: ['e'],
    };
  } else {
    resizableProps = {
      minConstraints: [Infinity, 24],
      maxConstraints: [Infinity, window.innerHeight * 0.9],
      height: 300,
      width: Infinity,
      resizeHandles: ['s'],
    };
  }

  return <ResizableBox {...resizableProps}>{children}</ResizableBox>;
};

export default Resizable;
