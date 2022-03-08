import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  Default,
  DataType,
  PrimaryKey,
  BelongsTo,
} from "sequelize-typescript";
import { v4 } from "uuid";

@Table({
  timestamps: true,
  tableName: "contract_sources",
  underscored: true,
})
export default class ContractSource extends Model {
  @Default(v4)
  @PrimaryKey
  @Column(DataType.UUID)
  id: string;
  @CreatedAt
  created_at!: Date;
  @UpdatedAt
  updated_at!: Date;

  @Column(DataType.STRING)
  address: string;

  @Column(DataType.INTEGER)
  chain_id: number;

  @Column(DataType.STRING)
  source: string;

  @Column(DataType.STRING)
  name: string;

  @Column(DataType.JSON)
  abi: any;
}
