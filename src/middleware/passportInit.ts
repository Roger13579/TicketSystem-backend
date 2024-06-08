import passport, { Profile } from 'passport';
import {
  Strategy as GoogleStrategy,
  VerifyCallback,
} from 'passport-google-oauth20';
import { IUserReq, TMethod } from '../types/common.type';

export const PassportInit: TMethod<IUserReq, void> = async (req, res, next) => {
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
