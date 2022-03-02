"use strict";
import Router, { RouterContext } from "koa-router";
import nacl from "tweetnacl";
import Base58 from "base-58";
import { TextEncoder } from "util";

import passport from "../utils/passport";
import { setJwtHeaderOnLogin } from "../utils/jwt";
import { Next } from "koa";
import User from "../models/User.model";
import Web3PublicKey from "../models/Web3PublicKey.model";
import logger from "../utils/logger";

const authRouter = new Router({
  prefix: "/auth",
});
const ENCRYPTED_MSG = `Open sesame!`;

/* AUTH */
const _authFunc = (strat: string) => {
  return async (ctx: RouterContext, next: Next) => {
    return passport.authenticate(strat, (err: Error, user: User) => {
      if (!user) {
        ctx.body = err;
        ctx.throw(401);
      } else {
        ctx.status = 200;
        setJwtHeaderOnLogin(ctx, user);
        return;
      }
    })(ctx, next);
  };
};

authRouter.get("/current_user", async (ctx, next) => {
  return passport.authenticate("jwt", (err: Error, user: User) => {
    ctx.body = {
      user: user,
      token: ctx.request.headers["authorization"],
    };
    ctx.status = 200;
    next();
  })(ctx, next);
});
authRouter.post("/create", async (ctx, next) => {
  // password is a Buffer, key is a base58 encoded string
  const { password, key } = ctx.request.body;
  const enc = new TextEncoder();
  if (
    nacl.sign.detached.verify(
      enc.encode(ENCRYPTED_MSG),
      new Uint8Array(password.data),
      Base58.decode(key)
    )
  ) {
    try {
      return await Web3PublicKey.findByPk(key).then(async (account) => {
        if (account) {
          return _authFunc("local")(ctx, next);
        } else {
          // Create account object
          const newUser = await User.create();
          await Web3PublicKey.create({
            key: key,
            user_id: newUser.id,
          });
          return _authFunc("local")(ctx, next);
        }
      });
    } catch (err) {
      logger.error("/create", [err]);
    }
  } else {
    ctx.throw(401);
  }
});
authRouter.post("/facebook", _authFunc("facebook-token"));
authRouter.get(
  "/auth/facebook",
  passport.authenticate("facebook", {
    scope: ["email"],
  })
);
authRouter.get("/facebook/callback", _authFunc("facebook"));

export default authRouter;
