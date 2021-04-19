// Imports the Monaco Editor React Component it a wrapper around
// the real Monaco Editor

// ctrl+click @monaco-editor to get to type definition file and see all the
// config properties and interfaces we need to set
import MonacoEditor from '@monaco-editor/react';

// Set language to JS to get autocomplete, code linting, highlighting etc. similar
// to VSCode. Set theme to dark.
// Install actual monaco-editor package to get access to its type definition file
// Use type definition file instructions/interface requirements to enable
// wordwrap, disable code minimap, not to fade out unused imports, not to show
// empty space on left side before line numbers, not to be able to scroll down
// beyond last line, and the editor automatically updates its layout correctly
// when it is resized or adjusted
const CodeEditor = () => {
  return (
    <MonacoEditor
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
