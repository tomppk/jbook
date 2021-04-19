// Imports the Monaco Editor React Component it a wrapper around
// the real Monaco Editor

// ctrl+click @monaco-editor to get to type definition file and see all the
// config properties and interfaces we need to set
// Import also EditorDidMount type definition or interface
// Prettier code formatter and parser to format javascript code
import { useRef } from 'react';
import MonacoEditor, { EditorDidMount } from '@monaco-editor/react';
import prettier from 'prettier';
import parser from 'prettier/parser-babel';

// Define interface to satisfy to use CodeEditor component
interface CodeEditorProps {
  initialValue: string;
  onChange(value: string): void;
}

// Set language to JS to get autocomplete, code linting, highlighting etc. similar
// to VSCode. Set theme to dark.
// Install actual monaco-editor package to get access to its type definition file
// Use type definition file instructions/interface requirements to enable
// wordwrap, disable code minimap, not to fade out unused imports, not to show
// empty space on left side before line numbers, not to be able to scroll down
// beyond last line, and the editor automatically updates its layout correctly
// when it is resized or adjusted.
// Extract passed in props
const CodeEditor: React.FC<CodeEditorProps> = ({ onChange, initialValue }) => {
  // Get reference to actual Monaco Editor instance inside react component
  // wrapper
  const editorRef = useRef<any>();

  // Function called when editor is rendered on the screen
  // First argument function to use to get current value of text that is inside
  // the editor.
  // Second argument is reference to editor itself. We can use that reference
  // to be told whenever a user changes the contents inside there
  // We add eventlistener to editor itself that tells us when the content inside
  // editor changes
  // Whenever there is change we call onChange passed by parent we are going to
  // update our input piece of state of <App> component
  const onEditorDidMount: EditorDidMount = (getValue, monacoEditor) => {
    // Set current reference to instance of monacoEditor
    editorRef.current = monacoEditor;

    monacoEditor.onDidChangeModelContent(() => {
      onChange(getValue());
    });

    // Set editor tab press to equal two spaces
    monacoEditor.getModel()?.updateOptions({ tabSize: 2 });
  };

  // Formats code inside editor
  // Get current value from editor, format value, set formatted value back
  // in the editor
  const onFormatClick = () => {
    // Get current text value from editor
    const unformatted = editorRef.current.getModel().getValue();

    // Format that value. Add config object to determine how to format
    // User babel parser for JS, use spaces instead of tabs, add semicolons end of
    // lines, use single quotes
    const formatted = prettier.format(unformatted, {
      parser: 'babel',
      plugins: [parser],
      useTabs: false,
      semi: true,
      singleQuote: true,
    });

    // Set the formatted value back in the editor
    editorRef.current.setValue(formatted);
  };

  return (
    <div>
      <button onClick={onFormatClick}>Format</button>
      <MonacoEditor
        editorDidMount={onEditorDidMount}
        value={initialValue}
        theme="dark"
        language="javascript"
        height="500px"
        options={{
          wordWrap: 'on',
          minimap: {
            enabled: false,
          },
          showUnused: false,
          folding: false,
          lineNumbersMinChars: 3,
          fontSize: 16,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;
