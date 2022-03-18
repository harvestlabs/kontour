import {
  Table,
  Column,
  Model,
  CreatedAt,
  BelongsTo,
  ForeignKey,
  UpdatedAt,
  Default,
  DataType,
  PrimaryKey,
  AfterCreate,
  BeforeCreate,
} from "sequelize-typescript";
import { v4 } from "uuid";
import User from "./User.model";

@Table({
  timestamps: true,
  tableName: "api_keys",
  underscored: true,
})
export default class ApiKey extends Model {
  static User;

  @PrimaryKey
  @Column(DataType.STRING)
  key: string;
  @CreatedAt
  created_at!: Date;
  @UpdatedAt
  updated_at!: Date;

  @Column(DataType.STRING)
  user_id: string;

  @BelongsTo(() => User, "user_id")
  user: User;

  @BeforeCreate
  static async generateKey(instance: ApiKey) {
    let key;
    while (!key) {
      const result = [];
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      const charactersLength = characters.length;
      Array.from(Array(24)).forEach((i) => {
        result.push(
          characters.charAt(Math.floor(Math.random() * charactersLength))
        );
      });
      key = result.join("");
      const existing = await ApiKey.findByPk(key);
      if (existing) {
        key = null;
      }
    }

    instance.key = key;
  }

  static async getOrCreateForUser(userId: string): Promise<ApiKey> {
    const user = await User.findByPk(userId, {
      include: [ApiKey],
    });
    if (user.api_key) {
      return user.api_key;
    }
    const apiKey = await ApiKey.create({
      user_id: user.id,
    });
    return apiKey;
  }
}
