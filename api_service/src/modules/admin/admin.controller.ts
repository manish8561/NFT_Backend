import { Response, Request, Router } from "express";
import * as Interfaces from '../../interfaces';
import AdminModel from "./admin.model";
import { Helper } from '../../helpers';

class AdminController implements Interfaces.Controller {

    public path = "/admin";
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }
    private async initializeRoutes() {
        this.router
            .all(`${this.path}/*`)
            .post(`${this.path}/login`, this.adminLogin)
    }
    /**
     * @param  {Request} req
     * @param  {Response} res
     */
    private async adminLogin(req: Request | any, res: Response) {
        const { Response: { sendError, sendSuccess } } = Helper;
        try {
           if(Object.keys(req.body).length === 0) {
            return sendError(res, { status: 400, error: {message : 'No data posted'} })
        }
            let result = await AdminModel.login(req.body);
            if (result.errors) return sendError(res, { status: 400, error: result.errors });
            if (result.error) return sendError(res, { status: 400, error: result.error });
            console.log(result,'admin');
            const token: string = await AdminModel.generateJwtToken(result);
            return sendSuccess(res, { message: 'SUCCESS', token });
        } catch (error: any) {
            return sendError(res, { status: 400, error });
        }
    }

}

export default AdminController;