import {
  Includeable,
  WhereOptions,
  Model as OriginalModel,
  ModelStatic,
} from "sequelize";
import { PaginationRes } from "../types/paginator";

export async function findPaginate<M extends OriginalModel<any, any>>(
  model: ModelStatic<M>,
  where: WhereOptions = {},
  sort: any = "-createdAt",
  page: number = 0,
  limit: number = 15,
  include: Includeable[] = [],
  attributes: any[] = []
): Promise<PaginationRes<M>> {
  const offset = page * limit;
  const order = sort.split(",").map((s: string) => {
    if (s.startsWith("-")) {
      return [s.substring(1), "DESC"];
    }
    return [s, "ASC"];
  });
  const { count, rows } = await model.findAndCountAll({
    where,
    order,
    offset,
    limit,
    include,
    attributes,
    distinct: true,
    subQuery: false,
  });
  const pageInfo = {
    page,
    limit,
    hasNext: offset + limit < count,
    hasBefore: offset > 0,
    totalCount: count,
    totalPages: Math.ceil(count / limit),
  };
  return {
    items: rows,
    pageInfo,
  };
}
