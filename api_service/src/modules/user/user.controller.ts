import { NextFunction, Response, Request, Router } from "express";
import * as Interfaces from '../../interfaces';
import UserModel from "./user.model";
import { Helper } from '../../helpers';
import ValidateJWT from "../../middlewares/jwt.middleware";

class UserController implements Interfaces.Controller {

    public path = "/user";
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }
    private async initializeRoutes() {
        this.router
            .all(`${this.path}/*`)
            .post(`${this.path}/loginUserOrMaybeRegister`, this.loginUserOrMaybeRegister)
            .get(`${this.path}/details`, ValidateJWT, this.details)
    }
    /**
     * @param  {Request} req
     * @param  {Response} res
     */
    private async loginUserOrMaybeRegister(req: Request, res: Response) {
        const { Response: { sendError, sendSuccess } } = Helper;

        try {
            let result = await UserModel.loginUserOrMaybeRegister(req.body);
            if (result.errors) return sendError(res, { status: 400, error: result.errors });
            const token: string = await UserModel.generateJwtToken(result);
            result = { user: result };
            return sendSuccess(res, { message: 'SUCCESS', token });
        } catch (error: any) {
            return sendError(res, { status: 400, error });
        }
    }
    /**
     * @param  {Request} req
     * @param  {Response} res
     */
    private async details(req: any, res: Response) {
        const { Response: { sendError, sendSuccess } } = Helper;

        try {
            const { _id } = req.user!;
            console.log('hihihihhi')
            let result = await UserModel.details(_id);
            if (result.errors) return sendError(res, { status: 400, error: result.errors });
            return sendSuccess(res, { message: 'SUCCESS', data: result });
        } catch (error: any) {
            console.log(error,'controller')
            return sendError(res, { status: 400, error });
        }
    }
}

export default UserController;