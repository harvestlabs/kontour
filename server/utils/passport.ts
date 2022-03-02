"use strict";
import passport from "koa-passport";
import { Strategy as PassportLocal } from "passport-local";
import { Strategy as PassportTwitter } from "passport-twitter";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";

import config from "../../config";
import User from "../models/User.model";
import Web3PublicKey from "../models/Web3PublicKey.model";
import Profile from "../models/Profile.model";

const deserializeAccount = async function (id: string, done) {
  try {
    const account = await User.findByPk(id, { include: Web3PublicKey });
    done(null, account);
  } catch (err) {
    done(err, false);
  }
};
const LocalStrategy = new PassportLocal(
  {
    usernameField: "key",
    passwordField: "key",
  },
  (key, pw, cb) => {
    Web3PublicKey.findByPk(key, { include: [{ model: User }] }).then(
      async (acc) => {
        deserializeAccount(acc.user.id, cb);
      }
    );
  }
);

passport.use("local", LocalStrategy);
passport.use(
  "jwt",
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.auth.JWT_SECRET,
    },
    (payload, done) => {
      deserializeAccount(payload.userId, done);
    }
  )
);
// passport.use(
//   "twitter",
//   new PassportTwitter(
//     {
//       consumerKey: config.auth.TWITTER.CONSUMER_KEY,
//       consumerSecret: config.auth.TWITTER.CONSUMER_SECRET,
//       callbackURL: config.auth.TWITTER.CALLBACK_URL,
//     },
//     (token, tokenSecret, profile, cb) => {
//      profile.id }, function (err, user) {
//         return cb(err, user);
//       });
//     }
//   )
// );
passport.serializeUser((account: User, done) => {
  done(null, account.id);
});
passport.deserializeUser(deserializeAccount);

export default passport;
