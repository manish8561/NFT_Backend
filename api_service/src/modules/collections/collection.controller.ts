import { NextFunction, Response, Request, Router } from "express";
import * as Interfaces from '../../interfaces';
import UserModel from "./collection.model";
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
            console.log('Hit');
            const _user: Interfaces.User = req.body;
            console.log(_user);
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