import jwt from 'jsonwebtoken';
import UserModel from "../models/user";
import {CustomResponseType} from "../types/customResponseType";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

export class UserService {
    public async createUser(account: string, email: string, pwd: string, confirm_password: string): Promise<mongoose.Document> {
        this.userValidate(pwd, confirm_password);
        let findByEmail = await UserModel.findOne({ email: email });
        let findByAccount = await UserModel.findOne({ account: account });
        if (findByEmail) {
            let error = new Error(CustomResponseType.EMAIL_REGISTERED_MESSAGE + email);
            (error as any).status = CustomResponseType.EMAIL_REGISTERED;
            throw error;
        }else if (findByAccount){
            let error = new Error(CustomResponseType.ACCOUNT_REGISTERED_MESSAGE + account);
            (error as any).status = CustomResponseType.ACCOUNT_REGISTERED;
            throw error;
        }
        return await UserModel.create(new UserModel({
            email,
            account,
            pwd: bcrypt.hashSync(pwd, 10),
            accountType: 'member'
        }));
    }

    public async findByAccount(account: string): Promise<any> {
        return await UserModel.findOne({account: account}).exec();
    }

    public async generateJWT (userId: string, accountType: string): Promise<string> {
        const privateKey: any = process.env.JWT_SECRETS;
        const defaultOptions: object = {
            expiresIn: process.env.JWT_EXPIRES,
        };
        return jwt.sign({id: userId, accountType: accountType}, privateKey, Object.assign(defaultOptions));
    };

    public async generateForgotPasswordJWT (password: string, payload: string): Promise<string> {
        const privateKey: any = process.env.JWT_SECRETS + password;
        const defaultOptions: object = {
            expiresIn: process.env.JWT_EXPIRES,
        };
        return jwt.sign(payload, privateKey, Object.assign(defaultOptions));
    };

    private userValidate(pwd: string, confirmPwd: string): void{
        if (pwd !== confirmPwd) {
            this.throwError(CustomResponseType.PWD_CONFIRMPWD_NOT_THE_SAME_MESSAGE, CustomResponseType.PWD_CONFIRMPWD_NOT_THE_SAME);
        }
    }

    private throwError(message: string, code: string): any {
        let error = new Error(message);
        (error as any).status = code;
        throw error;
    }

// const validateToken = function (token: string): Object {
//     try {
//         const publicKey: any = process.env.JWT_SECRETS;
//         return jwt.verify(token, publicKey);
//     } catch (e) {
//         throw new HttpError({
//             title: 'invalid_token',
//             detail: 'Invalid token',
//             code: 400,
//         });
//     }};
}
