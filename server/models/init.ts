import { Sequelize } from "sequelize-typescript";
import config from "../../config";
import User from "./User.model";
import Web3PublicKey from "./Web3PublicKey.model";
import Project from "./Project.model";
import Contract from "./Contract.model";
import ContractSource from "./ContractSource.model";
import Profile from "./Profile.model";
import LoginData from "./LoginData.model";
import Node from "./Node.model";

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
    ContractSource,
    Contract,
    Project,
    Web3PublicKey,
    LoginData,
    Profile,
    Node,
  ]);
  postInit();
  return sequelize;
}

// This sucks, what even is this
function postInit() {
  Project.User = Project.belongsTo(User);
  User.Profile = User.hasOne(Profile);
  User.PublicKey = User.hasOne(Web3PublicKey);
  User.Projects = User.hasMany(Project);
  Profile.User = Profile.belongsTo(User);
  LoginData.User = LoginData.belongsTo(User);
  Node.Projects = Node.hasMany(Project);
}
