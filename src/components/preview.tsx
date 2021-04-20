import { useEffect, useRef } from 'react';
import './preview.css';

interface PreviewProps {
  code: string;
}

// Get our code inside iframe element so it gets executed separately
// inside iframe with no access to outside iframe for security reasons-
// Add basic html and div with id="root" ready for React components to use.
// Add <style> tag directly here to fix background overlap with resize handle
// Add script with event listener that enables indirect communication between
// parent element and child iframe
// Event listener listens for a message from parent element that contains the
// user inputted code as a string inside event.data
// eval() evaluates and executes Javascript inside browser
// Incase error display error inside root div and also inside console
// for further investigation
const html = `
    <html>
      <head>
        <style> html {background-color: white;}</style>
      </head>
      <body>
        <div id="root"></div>
        <script>
          window.addEventListener('message', (event) => {
            try {
              eval(event.data)
            } catch (err) {
              const root = document.querySelector('#root');
              root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + err + '</div>'
              console.error(err);
            }
          }, false);
        </script>
      </body>
    </html>
  `;

const Preview: React.FC<PreviewProps> = ({ code }) => {
  // Reference to iframe element
  const iframe = useRef<any>();

  // useEffect hook. Anytime we receive new code or code changes call this.
  // Before rendering any new code we reset the contents or srcdoc property
  // of iframe into our base html document defined below
  useEffect(() => {
    iframe.current.srcdoc = html;

    // When the code bundling process is complete we take the reference to iframe
    // and use that reference to emit or post a message down into the iframe
    // The message is the code string that user inputs in textarea
    // '*' is targetOrigin which means that target uri is any and not restricted
    // Wrap inside 50ms timeout so that the browser has enough time to actually
    // set up event listener and post message. Otherwise browser does not have
    // enough time to communicate between parent and child element with message
    setTimeout(() => {
      iframe.current.contentWindow.postMessage(code, '*');
    }, 50);
  }, [code]);

  // srcDoc allows us to load local string as src instead of url
  // We generate the html content ourselves instead of fetching it
  // if sandbox = "allow-same-origin" communication between parent element
  // and child iframe is possible, if this is missing then they cannot communicate.
  // If sandbox="allow-scripts" iframe can run js scripts
  // div "preview-wrapper" used to create fake DOM element when resizing so
  // the resizing works correctly with child element also
  return (
    <div className="preview-wrapper">
      <iframe
        title="preview"
        ref={iframe}
        srcDoc={html}
        sandbox="allow-scripts"
      />
    </div>
  );
};

export default Preview;
