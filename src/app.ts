import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { ErrorRequestHandler } from 'express';
import log4js from './config/log4js';
import path from 'path';
import morgan from 'morgan';
import { router } from './routes/router';
import connection from './config/dbConnection';
import globalMiddleware from './middleware/globalMiddleware';
import swaggerUi from 'swagger-ui-express';
import swaggerFile from './swagger-output.json';
import { DefaultException } from './utils/defaultException';
import passport from 'passport';
import { unknownRouteError } from './utils/errorHandler';

class App {
  public app: express.Application;
  constructor() {
    this.app = express();
    this.initLogger();
    this.app.use(cors());
    this.app.use(passport.initialize());
    this.app.use(morgan('dev'));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cookieParser());
    this.app.use(express.static(path.join(__dirname, 'public')));
    this.app.use(globalMiddleware);
    // db connection
    connection();
    // router 處理

    for (const route of router) {
      this.app.use(route.getPrefix(), route.getRouters());
    }
    // swagger

    this.app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));
    // 查無路由
    this.app.use(unknownRouteError);
    this.setException(DefaultException);
  }

  private initLogger() {
    const logger = log4js.getLogger();
    this.app.use(log4js.connectLogger(logger, { level: 'info' }));
  }

  private setException(handler: ErrorRequestHandler): void {
    this.app.use(handler);
  }
}

export default new App().app;
