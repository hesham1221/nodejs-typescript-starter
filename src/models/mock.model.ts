import { Table } from "sequelize-typescript";
import { IModel } from "../common/database/defaultModel";

@Table({ tableName: "mocks" })
export class MockModel extends IModel {}
