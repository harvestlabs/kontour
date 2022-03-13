import Router, { RouterContext } from "koa-router";

import passport from "../utils/passport";
import { setJwtHeaderOnLogin } from "../utils/jwt";
import { Next } from "koa";
import User from "../models/User.model";
import Profile from "../models/Profile.model";
import LoginData from "../models/LoginData.model";
import config from "../../config";

// A-String-Of-Names or something blah blah...213423-(actual encoded id)
const MAGIC_REGEX = "^[ A-Za-z0-9-]*(-[A-Za-z0-9]+)$";

const sdkRouter = new Router({
  prefix: "/sdk",
});
sdkRouter.get("/status", async (ctx, next) => {
  ctx.body = {
    status: "ok",
  };
  ctx.status = 200;
  next();
});
sdkRouter.get("/:magicString", async (ctx, next) => {
  const { key } = ctx.request.query;
  if (!key) {
    ctx.body = {
      error: `No API key provided - you're gonna want to get one from ${config.app.CLIENT_HOSTNAME}/key`,
    };
    ctx.status = 401;
  }
  const match = decodeURI(ctx.params.magicString).match(MAGIC_REGEX);
  if (match[1]) {
    // found an id
    const id = match[1].substring(1);
    const data = decodeId(id);
    switch (data.sdkIdType) {
      case SdkIdType.VERSION:
        break;
      case SdkIdType.INSTANCE:
        break;
    }
  }
});

enum SdkIdType {
  VERSION = 1,
  INSTANCE = 2,
}
interface DecodedMagicString {
  sdkIdType: SdkIdType;
  id: string;
}

const encodeId = (t: SdkIdType, id: string): string => {
  return Buffer.from(`${t}${id}`, "utf-8").toString("base64");
};
const decodeId = (s: string): DecodedMagicString => {
  const val = Buffer.from(s, "base64").toString("utf-8");
  return {
    sdkIdType: SdkIdType[val[0]],
    id: val.substring(1),
  };
};
