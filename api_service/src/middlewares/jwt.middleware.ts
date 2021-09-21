import { NextFunction, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { Helper } from '../helpers';

/**
 * @function ValidateJWT
 * @param req 
 * @param res 
 * @param next 
 */
const ValidateJWT = (req: Request | any, res: Response, next: NextFunction) => {
    const secret: string = process.env.JWTSECRET!;
    const { Response: { sendError } } = Helper;

    const token: string = req.headers['api-access-token'];
    jwt.verify(token, secret, (error: any, decoded: any) => {
        if (error) return sendError(res, { status: 400, error });
        req.user = decoded;
        next();
    });
}

export default ValidateJWT;