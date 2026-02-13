import { Model, ModelStatic } from "sequelize";

import { PaginatedResponse, paginateOptions } from "../interfaces";

export class Paginator<T extends Model> {
  constructor(private readonly model: ModelStatic<T>) {}

  async paginate({ page = 1, limit = 10, options }: paginateOptions<T>): Promise<PaginatedResponse<T>> {
    const offset = (+page - 1) * +limit;

    const { rows: data, count: totalRecords } = await this.model.findAndCountAll({
      ...options,
      offset,
      limit: +limit,
      distinct: true,
      col: "id",
    });

    const lastPage = data.length > 0 ? Math.ceil(totalRecords / +limit) : 0;

    const hasMorePages = +page < lastPage;

    return {
      last_page: lastPage,
      total_records: totalRecords,
      current_page: +page,
      has_more_pages: hasMorePages,
      data,
    };
  }
}
