import { Sequelize } from "sequelize-typescript";
import config from "../../config";

import User from "./User.model";
import ApiKey from "./ApiKey.model";
import Web3PublicKey from "./Web3PublicKey.model";
import Profile from "./Profile.model";
import LoginData from "./LoginData.model";

import Project from "./Project.model";
import ProjectVersion from "./ProjectVersion.model";
import Instance from "./Instance.model";

import Contract from "./Contract.model";
import RemoteContractSource from "./RemoteContractSource.model";
import LocalContractSource from "./LocalContractSource.model";

import Node from "./Node.model";
import NodeAccount from "./NodeAccount.model";

export default function init() {
  const sequelize = new Sequelize(
    config.mysql.DATABASE,
    config.mysql.USER,
    config.mysql.PASSWORD,
    {
      host: config.mysql.HOST,
      dialect: "mariadb",
      pool: {
        max: 4,
        min: 0,
        idle: 30000,
      },
      logging: false,
    }
  );

  sequelize.addModels([
    User,
    Web3PublicKey,
    ApiKey,
    LoginData,
    Profile,
    LocalContractSource,
    RemoteContractSource,
    Contract,
    Project,
    ProjectVersion,
    Instance,
    Node,
    NodeAccount,
  ]);
  postInit();
  return sequelize;
}

// This sucks, what even is this
function postInit() {
  Project.User = Project.belongsTo(User);
  Project.Versions = Project.hasMany(ProjectVersion);
  User.Profile = User.hasOne(Profile);
  User.PublicKey = User.hasOne(Web3PublicKey);
  User.Projects = User.hasMany(Project);
  Profile.User = Profile.belongsTo(User);
  LoginData.User = LoginData.belongsTo(User);
  Node.Projects = Node.hasMany(Project);
  Node.Contracts = Node.hasMany(Contract);
  NodeAccount.Node = NodeAccount.belongsTo(Node);
  NodeAccount.User = NodeAccount.belongsTo(User);
}
