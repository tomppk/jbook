# Tbook
Massive React and Typescript sample project for Udemy's React and Typescript project course. Not accessible as **npm package** at the moment. Needs debugging...

Interactive coding environment that runs inside browser. Can be run using **npx tbook serve** and then accessing http://localhost:4005 in browser.

## Features:
- Click any text cell to edit it
- The code in each editor is joined together. You can define a variable in one editor and refer to it in any following editor
- There is a **show()** function built into this environment. It can be used to show any React component, string, number, or anything else in the preview windows
- Cells can be re-ordered or deleted by using buttons on the top right
- Add new cells by hovering on the divider between each cell


All of your changes get saved to the file you opened Tbook with. So if you ran **npx tbook serve mynotes.js**, all of the text and code you write 
will be saved to the **mynotes.js** file. If no filename is specified, the default file created is **notebook.js**
