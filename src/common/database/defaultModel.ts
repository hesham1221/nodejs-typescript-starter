import {
  Column,
  CreatedAt,
  DataType,
  Default,
  Model,
  PrimaryKey,
  UpdatedAt,
} from "sequelize-typescript";
import { Field } from "type-graphql";

export class IModel extends Model<IModel> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  @Field()
  id: string;

  @CreatedAt
  @Column({ type: DataType.DATE })
  @Field()
  createdAt: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE })
  @Field()
  updatedAt: Date;
}
