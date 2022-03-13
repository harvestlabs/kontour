import {
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { GraphQLUpload } from "graphql-upload";
import ApiKey from "../models/ApiKey.model";
import RemoteContractSource from "../models/RemoteContractSource.model";
import LocalContractSource from "../models/LocalContractSource.model";
import { uploadFile } from "../utils/s3";
import ContractSourceType from "./types/contractSource";

const ContractSourceQueries = {
  remoteContractSource: {
    type: ContractSourceType,
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (parent, args, ctx, info) => {
      const source = await RemoteContractSource.findByPk(args.id);
      if (source.user_id !== ctx.state?.user?.id) {
        return null;
      }
      return source;
    },
  },
  localContractSource: {
    type: ContractSourceType,
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (parent, args, ctx, info) => {
      const source = await LocalContractSource.findByPk(args.id);
      if (source.user_id !== ctx.state?.user?.id) {
        return null;
      }
      return source;
    },
  },
  myContractSources: {
    type: new GraphQLNonNull(
      new GraphQLList(new GraphQLNonNull(ContractSourceType))
    ),
    args: {},
    resolve: async (parent, args, ctx, info) => {
      const userId = ctx.state?.user?.id;
      if (!userId) {
        return [];
      }
      const localSources = await LocalContractSource.findAll({
        where: {
          user_id: userId,
        },
      });
      const remoteSources = await RemoteContractSource.findAll({
        where: {
          user_id: userId,
        },
      });
      return [...localSources, ...remoteSources];
    },
  },
};

const ContractSourceMutations = {
  createFromTruffleJSON: {
    type: ContractSourceType,
    args: {
      truffleJSON: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (parent, args, ctx, info) => {
      return await LocalContractSource.uploadToS3(
        ctx.state.user.id,
        JSON.parse(args.truffleJSON)
      );
    },
  },
  createFromS3File: {
    type: ContractSourceType,
    args: {
      key: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (parent, args, ctx, info) => {
      return await LocalContractSource.importFromS3(
        args.key,
        ctx.state.user.id
      );
    },
  },
  ingestFromQuikdraw: {
    type: ContractSourceType,
    args: {
      file: {
        type: GraphQLUpload,
      },
      apiKey: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (parent, args, ctx, info) => {
      const apiKey = await ApiKey.findByPk(args.apiKey);

      const { filename, mimetype, createReadStream, encoding } =
        await args.file;
      const fileChunks = [];
      const stream = createReadStream();
      stream.on("readable", () => {
        let chunk;
        while (null !== (chunk = stream.read())) {
          fileChunks.push(chunk);
        }
      });
      await new Promise<void>((resolve) =>
        stream.on("end", async () => {
          const imageBuffer = Buffer.concat(fileChunks);
          await uploadFile(apiKey.user_id, filename, mimetype, imageBuffer);
          resolve();
        })
      );
    },
  },
};

export { ContractSourceQueries, ContractSourceMutations };
