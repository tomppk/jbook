import { ResizableBox } from 'react-resizable';

// Interface to define required props for the component
interface ResizableProps {
  direction: 'horizontal' | 'vertical';
}

// Extract direction and children.
// We always receive children props if we try to place some content or another
// React component inside this component as props
// By wrapping children with this component we can make them resizable.
//
const Resizable: React.FC<ResizableProps> = ({ direction, children }) => {
  return (
    <ResizableBox height={300} width={300} resizeHandles={['s']}>
      {children}
    </ResizableBox>
  );
};

export default Resizable;
