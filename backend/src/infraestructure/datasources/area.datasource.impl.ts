import { FindOptions } from "sequelize";

import { AreaDatasource, AreaEntity, CreateAreaDto, IGetAreasParams } from "../../domain";
import { PaginatedResponse, Paginator } from "../../shared";

import Area from "../database/models/area.model";
import UserArea from "../database/models/user-area.model";
import User from "../database/models/user.model";

export class AreaDatasourceImpl implements AreaDatasource {
  private paginator: Paginator<Area>;

  constructor() {
    this.paginator = new Paginator(Area);
  }

  async assignAreaToUsers(area_id: number, user_id: number): Promise<void> {
    await UserArea.create({ area_id, user_id });
  }

  async create(data: CreateAreaDto): Promise<AreaEntity> {
    const area = await Area.create(data);

    return area;
  }

  async delete(id: number): Promise<void> {
    await Area.destroy({ where: { id } });
  }

  async findAll({ limit, page, where }: IGetAreasParams): Promise<PaginatedResponse<AreaEntity>> {
    const optionsQuery: FindOptions = {
      attributes: ["id", "name", "code"],
      include: [
        {
          as: "manager",
          attributes: ["id", "names", "last_names", "email", "username", "avatar_url"],
          model: User,
        },
      ],
      order: [["id", "DESC"]],
      where,
    };

    const paginatedResult = await this.paginator.paginate({
      options: optionsQuery,
      page,
      limit,
    });

    const data = paginatedResult.data.map(AreaEntity.fromObject);

    return {
      ...paginatedResult,
      data,
    };
  }

  async findById(id: number): Promise<AreaEntity | null> {
    const area = await Area.findOne({
      attributes: ["id", "name", "code"],
      include: [
        {
          as: "manager",
          attributes: ["id", "names", "last_names", "email", "username", "avatar_url"],
          model: User,
        },
      ],
      where: { id },
    });

    return area ? AreaEntity.fromObject(area) : null;
  }

  async update(id: number, data: Partial<CreateAreaDto>): Promise<void> {
    await Area.update(data, { where: { id } });
  }

  async unassignAreaToUsers(area_id: number, user_id: number): Promise<void> {
    await UserArea.destroy({ where: { area_id, user_id } });
  }

  async userHasActiveAreaMember(user_id: number, area_id: number): Promise<boolean> {
    const user = await UserArea.findOne({ raw: true, where: { user_id, area_id } });

    return !!user;
  }

  async userHasActiveAreaManager(user_id: number, area_id: number): Promise<boolean> {
    const user = await Area.findOne({ raw: true, where: { manager_id: user_id, id: area_id } });

    return !!user;
  }
}
