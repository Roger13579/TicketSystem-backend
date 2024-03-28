import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import log4js from './config/log4js';
import path from 'path';
import morgan from 'morgan';
import {router} from "./routes/router";
// import {appError, errorHandlerMainProcess} from './utils/errorHandler';

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

    // router 處理
    for (const route of router){
      this.app.use(route.getPrefix(), route.getRouters());
    }
  }

  private initLogger() {
    const logger = log4js.getLogger();
    this.app.use(log4js.connectLogger(logger, { level: 'info' }));
  }
  // // 錯誤管理
  //     app.use(errorHandlerMainProcess);
  //     app.use((req, res, next) => {
  //     next(appError(404, '40401', '無此路由資訊'));
  // });
}

export default new App().app;
