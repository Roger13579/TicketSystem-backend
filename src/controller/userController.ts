import {Request, Response} from "express";

class UserController{

    index(req: Request, res: Response){
        res.type('text/plain');
        res.send('useruseruser')
    }
}

export default UserController