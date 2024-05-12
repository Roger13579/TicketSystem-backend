import passport, { Profile } from 'passport';
import { NextFunction, Response, Request } from 'express';
import {
  Strategy as GoogleStrategy,
  VerifyCallback,
} from 'passport-google-oauth20';

export const PassportInit = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
        clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_OAUTH_CALLBACK_URL,
      },
      (
        _accessToken: string,
        _refreshToken: string,
        profile: Profile,
        cb: VerifyCallback,
      ) => {
        return cb(null, profile);
      },
    ),
  );
  return next();
};
