import express from 'express';
// Default Node module for saving/loading files off of hard drive
// import submodule /promises to be able to write async/await code and not
// need to use callbacks
import fs from 'fs/promises';

export const createCellsRouter = (filename: string, dir: string) => {
  // Add routes to Router object and merge it back into our app at index.ts
  const router = express.Router();

  router.get('/cells', async (req, res) => {
    // Make sure the cell storage file exists
    // If it does not exist, add in a default list of cells
    // Read the file
    // Parse a list of cells out of it
    // Send list of cells back to browser
  });

  router.post('/cells', async (req, res) => {
    // Take the list of cells from the request obj
    // serialize them ie. turn them into format to be safely written in the file
    // Write the cells into the file
  });

  return router;
};
