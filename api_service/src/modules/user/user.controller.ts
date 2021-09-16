import { Router } from 'express';
import { NextFunction } from 'express-serve-static-core';
import { Helper } from '../../helpers';
import * as Interfaces from '../../interfaces';
import RequestDecrypt from '../../middlewares/encryption.middleware';
import UserModel from './user.model';

const { 
    Response: {_error, _success}
 } = Helper;

class UserController implements Interfaces.Controller {
    public path = "/user";
    public router = Router();
    constructor() {
        this.initializeRoutes();
    }
    private async initializeRoutes() {
        this.router
            .all(`${this.path}/*`)
            .post(`${this.path}/checkUserAndMaybeRegister`, RequestDecrypt, this.checkUserAndMaybeRegister)
    }

    public async checkUserAndMaybeRegister(req: Request, res: Response, next: NextFunction) {
        try {
            const _user: Interfaces.User = req.body;
            let result = await UserModel.checkUserAndMaybeRegister(_user);

            if (result.errors) return _error(res, { status: 400, error: result.errors });

            const token: string = await UserModel.generateJwtToken(result);

            result = { user: result };
            return _success(res, { message: 'SUCCESS', data: result, token });
        } catch(error) {
            return _error(res, { status: 400, error });
        }
    }
}

export default UserController;