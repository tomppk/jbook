import { ResizableBox } from 'react-resizable';
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
const Resizable: React.FC<ResizableProps> = ({ direction, children }) => {
  return (
    <ResizableBox height={300} width={Infinity} resizeHandles={['s']}>
      {children}
    </ResizableBox>
  );
};

export default Resizable;
