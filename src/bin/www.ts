#!/usr/bin/env node

/**
 * Module dependencies.
 */
import app from '../app';
import http from 'http';
import log4js from '../config/log4js';
import env from 'dotenv';

const logger = log4js.getLogger(`init`);

env.config();

/**
 * Normalize a port into a number, string, or false.
 */

const normalizePort = (val: string) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT);
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

// Socket.io
// import socket from '../service/socket-io.js';
// socket.connectSocketIO(server);

/**
 * Event listener for HTTP server "error" event.
 */

const onError = (error: NodeJS.ErrnoException) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      logger.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

/**
 * Event listener for HTTP server "listening" event.
 */

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + port;
  logger.info('Listening on ' + bind);
};

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, () => {
  logger.info(`server start at port ${port} `);
});
server.on('error', onError);
server.on('listening', onListening);
