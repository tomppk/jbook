import express from 'express';
// Default Node module for saving/loading files off of hard drive
// import submodule /promises to be able to write async/await code and not
// need to use callbacks
import fs from 'fs/promises';
import path from 'path';

interface Cell {
  id: string;
  content: string;
  type: 'text' | 'code';
}

export const createCellsRouter = (filename: string, dir: string) => {
  // Add routes to Router object and merge it back into our app at index.ts
  const router = express.Router();
  // Use body parsing middleware to enable parsing JSON from req.body
  router.use(express.json);

  // Create full path name by combining dir and filename
  const fullPath = path.join(dir, filename);

  router.get('/cells', async (req, res) => {
    try {
      // Read the file
      const result = await fs.readFile(fullPath, { encoding: 'utf-8' });

      res.send(JSON.parse(result));
    } catch (err) {
      // If read throws an error
      // If the error says that the file does not exist, then create new file
      // ENOENT error no entity ie. file does not exist
      if (err.code === 'ENOENT') {
        // Create a file and add default cells as empty array
        // Send response of empty array ie. no cells back to the browser
        await fs.writeFile(fullPath, '[]', 'utf-8');
        res.send([]);
      } else {
        throw err;
      }
    }

    // Parse a list of cells out of it
    // Send list of cells back to browser
  });

  // Route to save code and text cells into a file at local file system
  router.post('/cells', async (req, res) => {
    // Take the list of cells from the request object. Cells is an array of
    // Cell objects
    // serialize them ie. turn them into format to be safely written in the file
    const { cells }: { cells: Cell[] } = req.body;

    // Write the cells into the file at fullPath by converting Javascript objects
    // into JSON strings with standard 'utf-8' encoding ie. plain text
    await fs.writeFile(fullPath, JSON.stringify(cells), 'utf-8');

    // Send back response
    res.send({ status: 'ok' });
  });

  return router;
};
