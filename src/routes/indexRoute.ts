import BaseRoute from "./baseRoute";
import IndexController from "../controller/indexController";

class IndexRoute extends BaseRoute{
    private indexController = new IndexController();

    constructor() {
        super();
        this.setRouters();
    }

    protected setRouters(){
        this.router.get('/123', this.indexController.index)
    }

}

export default IndexRoute