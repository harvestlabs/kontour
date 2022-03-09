"use strict";
import Router, { RouterContext } from "koa-router";

import passport from "../utils/passport";
import { setJwtHeaderOnLogin } from "../utils/jwt";
import { Next } from "koa";
import User from "../models/User.model";
import Profile from "../models/Profile.model";
import LoginData from "../models/LoginData.model";

const authRouter = new Router({
  prefix: "/auth",
});

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
authRouter.post("/login", passport.authenticate("local"));
authRouter.post("/create", async (ctx, next) => {
  const { email, password } = ctx.request.body;
  const maybeLogin = await LoginData.findOne({
    where: {
      email: email,
    },
  });
  if (maybeLogin) {
    ctx.status = 400;
    ctx.body = { message: "A user with this email already exists" };
    return;
  }
  const user = await User.create({});
  await LoginData.create({
    email: email,
    password: password,
    user_id: user.id,
  });
  ctx.status = 200;
  setJwtHeaderOnLogin(ctx, user);
  return;
});

authRouter.get("/twitter", passport.authenticate("twitter"));
authRouter.get("/twitter_callback", async (ctx: RouterContext, next: Next) => {
  return passport.authenticate(
    "twitter",
    async (err: Error, { id, handle, image_url }) => {
      const largeImgUrl = image_url.replace("_normal.jpg", ".jpg");
      const maybeLogin = await LoginData.findOne({
        where: {
          twitter_id: id,
        },
        include: [
          {
            model: User,
            include: [Profile],
          },
        ],
      });
      let user = maybeLogin?.user;
      if (!user) {
        user = await User.create({});
        await LoginData.create({
          twitter_handle: handle,
          twitter_id: id,
          user_id: user.id,
        });
        const profile = await Profile.findOne({
          where: {
            user_id: user.id,
          },
        });
        profile.image_url = largeImgUrl;
        await profile.save();
      } else {
        user.profile.image_url = largeImgUrl;
        await user.profile.save();
      }
      ctx.status = 200;
      setJwtHeaderOnLogin(ctx, user);
      return;
    }
  )(ctx, next);
});

authRouter.get("/github", passport.authenticate("github"));
authRouter.get("/github_callback", async (ctx: RouterContext, next: Next) => {
  return passport.authenticate(
    "github",
    async (err: Error, { id, email, handle, image_url }) => {
      const maybeLogin = await LoginData.findOne({
        where: {
          github_id: id,
        },
        include: [
          {
            model: User,
            include: [Profile],
          },
        ],
      });
      let user = maybeLogin?.user;
      if (!user) {
        user = await User.create({});
        await LoginData.create({
          github_id: id,
          github_handle: handle,
          user_id: user.id,
        });
        const profile = await Profile.findOne({
          where: {
            user_id: user.id,
          },
        });
        profile.image_url = image_url;
        await profile.save();
      } else {
        user.profile.image_url = image_url;
        await user.profile.save();
      }
      ctx.status = 200;
      setJwtHeaderOnLogin(ctx, user);
      return;
    }
  )(ctx, next);
});

export default authRouter;
