import indexRoute from './indexRoute'
import userRoute from "./userRoute";
import BaseRoute from "./baseRoute";

export const router: Array<BaseRoute> =
    [new indexRoute(), new userRoute()]