import {Request, Response} from "express";

class IndexController{

    index(req: Request, res: Response){
        res.type('text/plain');
        res.send('testetsetsetest')
    }
}

export default IndexController