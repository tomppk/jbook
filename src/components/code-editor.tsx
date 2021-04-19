// Imports the Monaco Editor React Component it a wrapper around
// the real Monaco Editor

// ctrl+click @monaco-editor to get to type definition file and see all the
// config properties and interfaces we need to set
import MonacoEditor from '@monaco-editor/react';

// Set language to JS to get autocomplete, code linting, highlighting etc. similar
// to VSCode
const CodeEditor = () => {
  return <MonacoEditor language="javascript" height="500px" />;
};

export default CodeEditor;
