import { Router } from 'express';

abstract class BaseRoute {
  protected router = Router();

  protected abstract setRouters(): void;

  protected prefix: string = '/';

  public getRouters() {
    return this.router;
  }

  public getPrefix() {
    return this.prefix;
  }
}

export default BaseRoute;
