const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');

const router = require('./routers/contact.router');
const userRouter = require('./routers/user.router');

require('dotenv').config();

class Server {
  constructor() {
    this.server = null;
  }

  async start() {
    this.initServer();
    this.initMiddlewares();
    this.initRoutes();
    await this.initDatabase();
    return this.startListening();
  }

  initServer() {
    this.server = express();
  }

  initMiddlewares() {
    this.server.use(cors());
    this.server.use(express.json());
    this.server.use(morgan('dev'));
    this.server.use(express.static(path.resolve(__dirname, 'public')));
  }

  initRoutes() {
    this.server.use('/contacts', router);
    this.server.use('/auth', userRouter);
  }

  async initDatabase() {
    try {
      await mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      return console.log('Database connection successful');
    } catch (err) {
      console.log('Databse connection Error:', err);
      process.exit(1);
    }
  }

  startListening() {
    const PORT = process.env.PORT;

    return this.server.listen(PORT, () => {
      console.log('Server listening on port:', PORT);
    });
  }
}

const server = new Server();
server.start();
