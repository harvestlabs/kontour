import Router, { RouterContext } from "koa-router";
import fetch from "node-fetch";
import fs from "fs";

import passport from "../utils/passport";
import { setJwtHeaderOnLogin } from "../utils/jwt";
import { Next } from "koa";
import User from "../models/User.model";
import Profile from "../models/Profile.model";
import LoginData from "../models/LoginData.model";
import config from "../../config";
import GithubData from "../models/GithubData.model";
import { App } from "@octokit/app";

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

      ctx.redirect(config.app.CLIENT_HOSTNAME);
    }
  )(ctx, next);
});

authRouter.get("/github", passport.authenticate("github"));
authRouter.get("/github_callback", async (ctx: RouterContext, next: Next) => {
  return passport.authenticate("github", async (err: Error, data) => {
    console.log(data, err);

    const { id, email, handle, image_url } = data || {};
    console.log("did it succeed", err, id, email, handle, image_url);
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
    console.log("outside user", user);
    if (!user) {
      user = await User.create({});
      console.log("no user", user);
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
    ctx.redirect(config.app.CLIENT_HOSTNAME);
  })(ctx, next);
});
authRouter.get(
  "/github/app_callback",
  async (ctx: RouterContext, next: Next) => {
    const { code, installation_id } = ctx.request.query;

    const TOKEN_URL = `https://github.com/login/oauth/access_token`;
    let resp = await fetch(TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: config.github.APP_CLIENT_ID,
        client_secret: config.github.APP_CLIENT_SECRET,
        code: code,
      }),
    });
    const { access_token, refresh_token } = await resp.json();
    resp = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `token ${access_token}`,
        Accept: "application/json",
      },
    });
    const { login, id, avatar_url } = await resp.json();

    let finalUser;
    const loggedInUser = ctx.state?.user;
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
    // #1 Happy case: no github acc exists, no user is logged in
    // We create the LoginData for the github account and create the new user
    //
    // #2 case: Github user account does not exist, user is logged in
    // and they are not the same id. We create LoginData for the existing user
    if (!maybeLogin) {
      if (!loggedInUser) {
        finalUser = await User.create({});
      } else {
        finalUser = loggedInUser;
      }
      await LoginData.create({
        github_id: id,
        github_handle: login,
        user_id: finalUser.id,
      });
      const profile = await Profile.findOne({
        where: {
          user_id: finalUser.id,
        },
      });
      profile.image_url = avatar_url;
      await profile.save();
    }
    // #3 case: Github user account exists, no user is logged in
    // OR user logged in is the same as the github user
    // We set the logged in user to the github user and refresh the image
    //
    // #4 case: Github user account exists, user is logged in
    // They are different user ids - we log in as the github user
    else {
      finalUser = maybeLogin.user;
      finalUser.profile.image_url = avatar_url;
      await finalUser.profile.save();
    }

    const appOctokit = new App({
      appId: config.github.APP_ID,
      privateKey: config.github.APP_PK,
    });
    const octokit = await appOctokit.getInstallationOctokit(
      Number(installation_id)
    );
    const { data } = await octokit.request(
      "GET /app/installations/{installation_id}",
      {
        installation_id: Number(installation_id),
      }
    );
    const existingGHData = await GithubData.findOne({
      where: {
        user_id: finalUser.id,
        github_id: data.account.id,
      },
    });
    if (!existingGHData) {
      await GithubData.create({
        user_id: finalUser.id,
        github_app_install_id: Number(installation_id),
        github_id: data.account.id,
        github_handle: data.account.login,
      });
    } else {
      existingGHData.github_app_install_id = Number(installation_id);
      existingGHData.github_handle = data.account.login;
      await existingGHData.save();
    }
    ctx.status = 200;
    setJwtHeaderOnLogin(ctx, finalUser);
    return;
  }
);

export default authRouter;
