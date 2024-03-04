import { createReadStream } from 'fs';
import csvParser from 'csv-parser';
import { routes } from './routes.js';

const postRoute = routes.find(route => route.method === 'POST');
(async () => {

  if (!postRoute) {
    console.error('POST route not found.');
    process.exit(1);
  }

  // Initialise the parser by generating random records
  const parser = createReadStream('./file.csv').pipe(csvParser());

  // Iterate over each row of the parsed CSV data asynchronously
  for await (const row of parser) {
    try {
      // Execute the POST request for each row
      await postTask(row); // Pass postRoute as a parameter
      console.log('POST request succeeded for row:', row);
    } catch (error) {
      console.error('Error executing POST request for row:', row, error);
    }
  }
})();

async function postTask(row) { // Receive postRoute as a parameter
  // Assuming that the request object has a `body` property
  const request = { body: row };
  const response = {
    writeHead: () => {},
    end: () => {}
  };

  const test = await postRoute.handler(request, response)
  // Execute the POST request handler
  return await postRoute.handler(request, response);
}
