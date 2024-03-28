import BaseRoute from "./baseRoute";
import userController from "../controller/userController";

class UserRoute extends BaseRoute{
    private userController = new userController();

    constructor() {
        super();
        this.setRouters();
        this.prefix = '/user'
    }

    protected setRouters(){
        this.router.get('/login', this.userController.index)
    }

}

export default UserRoute