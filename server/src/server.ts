import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import path from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Request, Response } from 'express';

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
// Import the routes
import routes from './routes/index.js';

const app = express();

const PORT = process.env.PORT || 3001;

// TODO: Serve static files of entire client dist folder
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../../client/dist')))

    
        app.get('*', (_req: Request, res: Response) => {
        res.sendFile(path.join(__dirname, "../../client/dist/index.html"))
    })
}
// TODO: Implement middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// TODO: Implement middleware to connect the routes
app.use(routes);

// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
