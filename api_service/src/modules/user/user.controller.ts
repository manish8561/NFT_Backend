import { NextFunction, Response, Request, Router } from "express";
import * as Interfaces from '../../interfaces';
import UserModel from "./user.model";
import { Helper } from '../../helpers';

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
    }

    private async loginUserOrMaybeRegister(req: Request, res: Response, next: NextFunction) {
        const { Response: { sendError, sendSuccess } } = Helper;

        try {
            const _user = req.body;
            let result = await UserModel.loginUserOrMaybeRegister(_user);
            if (result.errors) return sendError(res, { status: 400, error: result.errors });
            const token: string = await UserModel.generateJwtToken(result);
            result = { user: result };
            return sendSuccess(res, { message: 'SUCCESS', data: result, token });
        } catch (error: any) {
            return sendError(res, { status: 400, error });
        }
    }
}

export default UserController;