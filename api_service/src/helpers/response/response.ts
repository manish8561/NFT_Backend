import { Response } from "express";
import * as Interfaces from '../../interfaces';

class ResponseHelper {
    
    /**
     * @funcation success
     * @param response 
     * @param data 
     * @returns Success Response
     */
    public sendSuccess(res: Response, data: any = {}) {
        return res.status(200).json({ ...data, status: "200" });
    } 

    /**
     * @fuction error
     * @param response 
     * @param errors 
     * @returns Error Response
     */
    public sendError(res: Response, errors: Interfaces.Error) {
        let { status } = errors;
        status = status || 400;
        return res.status(status).json({ errors });
    }

    /**
     * @function errors
     * @param message 
     * @param error 
     * @returns Transform Object For Errors
     */
    public errors(message: string, error: any = {}) {
        return { error: { message, error } };
    }

} 

export default new ResponseHelper();