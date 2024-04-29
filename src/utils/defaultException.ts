import { ErrorRequestHandler } from 'express';
import {CustomResponseType} from "../types/customResponseType";
export const DefaultException: ErrorRequestHandler = (err, req, res, next) =>{
    err.status = CustomResponseType.SYSTEM_ERROR;
    res.status(500).json(err);
}
