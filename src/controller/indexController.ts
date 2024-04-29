import { Request, Response } from 'express';

class IndexController {
  public async index(req: Request, res: Response): Promise<any> {
    return new Promise((resolve) => {
      res.send('Welcome');
      resolve('123');
    });
  }
}

export default IndexController;
