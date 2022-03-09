"use strict";
import passport from "koa-passport";
import { Strategy as PassportLocal } from "passport-local";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as PassportTwitter } from "passport-twitter";
import { Strategy as PassportGithub } from "passport-github";

import config from "../../config";
import User from "../models/User.model";
import Web3PublicKey from "../models/Web3PublicKey.model";
import Profile from "../models/Profile.model";
import EmailLogin from "../models/LoginData.model";

const deserializeAccount = async function (id: string, done) {
  try {
    const account = await User.findByPk(id, {
      include: [Web3PublicKey, Profile],
    });
    done(null, account);
  } catch (err) {
    done(err, false);
  }
};
const LocalStrategy = new PassportLocal(
  {
    usernameField: "email",
    passwordField: "password",
  },
  async (email, password, cb) => {
    const emailLogin = await EmailLogin.findByPk(email, { include: [User] });
    if (emailLogin.validPassword(password)) {
      deserializeAccount(emailLogin.user.id, cb);
    }
    cb("Incorrect password", false);
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
passport.use(
  "twitter",
  new PassportTwitter(
    {
      consumerKey: config.twitter.CONSUMER_KEY,
      consumerSecret: config.twitter.CONSUMER_SECRET,
      callbackURL: config.twitter.CALLBACK_URL,
    },
    (token, tokenSecret, profile, cb) => {
      cb(null, {
        id: profile.id,
        handle: profile.username,
        image_url: profile.photos[0].value,
      });
    }
  )
);
passport.use(
  "github",
  new PassportGithub(
    {
      clientID: config.github.CLIENT_ID,
      clientSecret: config.github.CLIENT_SECRET,
      callbackURL: config.github.CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, cb) => {
      console.log("github profile", profile);
      cb(null, {
        handle: profile.username,
        id: profile.id,
        email: profile.emails[0].value,
        image_url: profile.photos[0].value,
      });
    }
  )
);
passport.serializeUser((account: User, done) => {
  done(null, account.id);
});
passport.deserializeUser(deserializeAccount);

export default passport;
