// Imports the Monaco Editor React Component it a wrapper around
// the real Monaco Editor

// ctrl+click @monaco-editor to get to type definition file and see all the
// config properties and interfaces we need to set
import MonacoEditor from '@monaco-editor/react';

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
  // Function called when editor is rendered on the screen
  // First argument function to use to get current value of text that is inside
  // the editor.
  // Second argument is reference to editor itself. We can use that reference
  // to be told whenever a user changes the contents inside there
  // We add eventlistener to editor itself that tells us when the content inside
  // editor changes
  // Whenever there is change we call onChange passed by parent we are going to
  // update our input piece of state of <App> component
  const onEditorDidMount = (getValue: () => string, monacoEditor: any) => {
    monacoEditor.onDidChangeModelContent(() => {
      onChange(getValue());
    });
  };

  return (
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
  );
};

export default CodeEditor;
