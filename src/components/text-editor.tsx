import './styles/text-editor.css';
import MDEditor from '@uiw/react-md-editor';
import React, { useState, useEffect, useRef } from 'react';

const TextEditor: React.FC = () => {
  // Reference to div containing MDEditor in edit mode to know when user clicks
  // inside editor div and prevent event listener closing editor
  const ref = useRef<HTMLDivElement | null>(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    // Callback to close edit mode
    const listener = (event: MouseEvent) => {
      // Check to see whether ref.current and target clicked element exist
      // and whether the target that was clicked is inside our ref div
      // Define event.target as type Node to resolve Typescript type error
      // If click inside editor div, then return and do not setEditing false
      // or close editor.
      // If click outside editor then setEditing false and close editor
      if (
        ref.current &&
        event.target &&
        ref.current.contains(event.target as Node)
      ) {
        return;
      }
      setEditing(false);
    };

    // Add event listener to document that will bubble up to body and be called
    // whenever user clicks somewhere in document body
    document.addEventListener('click', listener, { capture: true });

    // Cleanup event listener before re-rendering
    return () => {
      document.removeEventListener('click', listener, { capture: true });
    };
  }, []);

  // If editing is true, render the markdown editor in edit mode.
  if (editing) {
    return (
      <div className="text-editor" ref={ref}>
        <MDEditor />
      </div>
    );
  }

  // If not editing render the editor in preview mode.
  // By clicking preview move back to edit mode
  return (
    <div className="text-editor" onClick={() => setEditing(true)}>
      <MDEditor.Markdown source={'# Header'} />
    </div>
  );
};

export default TextEditor;
