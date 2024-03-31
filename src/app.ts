import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import log4js from './config/log4js';
import path from 'path';
import morgan from 'morgan';
import { router } from './routes/router';
import connection from './config/dbConnection';
import globalMiddleware from "./middleware/globalMiddleware";
import {appErrorHandler, globalErrorHandler, unknownRouteError} from "./utils/errorHandler";

class App {
  public app: express.Application;
  constructor() {
    this.app = express();
    this.initLogger();
    this.app.use(cors());
    this.app.use(morgan('dev'));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cookieParser());
    this.app.use(express.static(path.join(__dirname, 'public')));
    this.app.use(globalMiddleware)

    // db connection
    connection();

    // router 處理
    for (const route of router) {
      this.app.use(route.getPrefix(), route.getRouters());
    }
    // 查無路由
    this.app.use(unknownRouteError);

    // 錯誤處理
    this.app.use(appErrorHandler);
    this.app.use(globalErrorHandler);
  }

  private initLogger() {
    const logger = log4js.getLogger();
    this.app.use(log4js.connectLogger(logger, { level: 'info' }));
  }
}

export default new App().app;
