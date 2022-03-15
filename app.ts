require("dotenv").config();

import Koa, { Context } from "koa";
import session from "koa-session";
import koaBody from "koa-body";
import cors from "@koa/cors";
import morgan from "koa-morgan";
import passport from "koa-passport";
import { ApolloServer } from "apollo-server-koa";
import { graphqlUploadKoa } from "graphql-upload";
import {
  ApolloError,
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from "apollo-server-core";
import { SubscriptionServer } from "subscriptions-transport-ws";
import * as Sentry from "@sentry/node";
import http from "http";

import apiPassport from "./server/utils/passport";
import apiRouter from "./server/routes/api";
import sdkRouter from "./server/routes/sdk";
import config from "./config";
import init from "./server/models/init";
import logger from "./server/utils/logger";

Sentry.init({
  dsn: "https://5504983dab14488ea98faa202ce94ec6@o1099620.ingest.sentry.io/6124364",
  tracesSampleRate: 1.0,
});

const app = new Koa();
app.keys = [config.auth.JWT_SECRET];
app.proxy = true;
app.use(
  session(
    {
      key: "koa.sess",
      maxAge: 86400000,
      autoCommit: true,
      overwrite: true,
      httpOnly: true,
      secure: config.app.IS_PROD,
      sameSite: config.app.IS_PROD ? "none" : "lax",
    },
    app
  )
);

app.use(koaBody({ multipart: true }));
export class LoggerStream {
  write(message: string) {
    logger.info(message.substring(0, message.lastIndexOf("\n")));
  }
}
app.use(
  cors({
    origin: async (ctx: Context) => {
      if (ctx.request.origin.match(new RegExp(config.auth.CLIENT_ORIGIN))) {
        return ctx.request.origin;
      }
      // This is useful for local dev, we expect localhost:3000
      return config.app.CLIENT_HOSTNAME;
    },
    credentials: true,
  })
);
app.use(
  morgan("combined", {
    stream: new LoggerStream(),
    skip: function (req, res) {
      return res.statusCode < 400;
    },
  })
);
// This does JWT auth on every POST request to the API and graphql API
app.use(async (ctx, next) => {
  if (ctx.cookies.get("auth_token")) {
    ctx.request.headers["authorization"] =
      "Bearer " + ctx.cookies.get("auth_token");
  }
  if (ctx.request.method == "OPTIONS") {
    return next();
  }
  if (ctx.path.indexOf("/graphql") === -1 && ctx.path.indexOf("/api") === -1) {
    return next();
  }
  await apiPassport.authenticate("jwt", (err, user) => {
    ctx.state.user = user;
  })(ctx, next);
  return next();
});
app.use(passport.initialize());
app.use(apiRouter.routes());
app.use(apiRouter.allowedMethods());
app.use(sdkRouter.routes());
app.use(sdkRouter.allowedMethods());

// TODO: hardcoded settings
app.use(graphqlUploadKoa({ maxFileSize: 10000000, maxFiles: 10 }));

init();

import schema from "./server/graphql/schema";
import { execute, subscribe } from "graphql";
import { verifyJwt } from "./server/utils/jwt";
const BASIC_LOGGING = {
  async requestDidStart(requestContext) {
    if (requestContext.request.query.includes("query IntrospectionQuery")) {
      return;
    }
    logger.info(requestContext.request.query, {
      variables: requestContext.request.variables,
    });
    return {
      async didEncounterErrors(requestContext) {
        logger.info(
          "an error happened in response to query " +
            requestContext.request.query,
          { error: requestContext.errors }
        );
      },
    };
  },
};
const SENTRY_ERRORS = {
  async requestDidStart() {
    return {
      async didEncounterErrors(ctx) {
        if (!ctx.operation) {
          return;
        }
        for (const err of ctx.errors) {
          // Only report internal server errors,
          // all errors extending ApolloError should be user-facing
          if (err instanceof ApolloError) {
            continue;
          }
          // Add scoped report details and send to Sentry
          Sentry.withScope((scope) => {
            scope.setTag("env", process.env.NODE_ENV);
            scope.setTag("kind", ctx.operation.operation);
            scope.setExtra("query", ctx.request.query);
            scope.setExtra("variables", ctx.request.variables);
            if (err.path) {
              scope.addBreadcrumb({
                category: "query-path",
                message: err.path.join(" > "),
                level: Sentry.Severity.Debug,
              });
            }
            Sentry.captureException(err);
          });
        }
      },
    };
  },
};

async function startApolloServer() {
  const httpServer = http.createServer();
  const subscriptionServer = SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
      async onConnect(connectionParams, webSocket) {
        if (connectionParams.Authorization) {
          const userId = await verifyJwt(connectionParams.Authorization);
          return { userId };
        }
        throw new Error("Missing auth token!");
      },
    },
    {
      server: httpServer,
      path: "/graphql",
    }
  );
  const plugins = [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            subscriptionServer.close();
          },
        };
      },
    },
    SENTRY_ERRORS,
  ];
  if (!config.app.IS_PROD) {
    plugins.push(ApolloServerPluginLandingPageGraphQLPlayground());
    plugins.push(BASIC_LOGGING);
  }
  const server = new ApolloServer({
    schema,
    plugins: plugins,
    context: ({ ctx }) => ctx,
  });

  await server.start();
  // @ts-ignore
  server.applyMiddleware({ app, path: "/graphql", cors: false });
  httpServer.on("request", app.callback());
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: config.app.PORT }, resolve)
  );
  console.log(`Started ${new Date()}`);
  return { server, app };
}

startApolloServer();
