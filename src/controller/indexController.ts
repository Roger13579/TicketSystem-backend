import { Request, Response } from 'express';

class IndexController {
  public index(req: Request, res: Response): void {
    res.type('text/plain');
    res.send('test');
  }
}

export default IndexController;
