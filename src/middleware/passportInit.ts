import passport from 'passport';
import { NextFunction, Response, Request } from 'express';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

export const PassportInit = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_OAUTH_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET as string,
        callbackURL: process.env.GOOGLE_OAUTH_CALLBACK_URL as string,
      },
      (
        accessToken: any,
        refreshToken: any,
        profile: any,
        cb: (arg0: null, arg1: any) => any,
      ) => {
        return cb(null, profile);
      },
    ),
  );
  return next();
};
