import express, { Application, Request, Response } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from "cors"
import { startDb } from './db/connection';
import routes from './routes';

const port = 3000;

const app: Application = express();
const server = createServer(app);
const io = new Server(server);

const boot = async () => {
  try {
  
    await startDb();

    app.use(express.json())
    app.use(cors())
    app.use("/", routes)

    io.on('connection', (socket) => {
      console.log('user connected');
    });

    server.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
    
  } catch (error) {
    console.error('Failed to start application:', error);
    process.exit(1); 
  }
};

boot();
