import { WhereOptions } from "sequelize";

export interface IGetJobRolesParamsDto {
  page: number;
  limit: number;
  name: string;
  store: number;
}

export interface IGetJobRolesParams {
  page: number;
  limit: number;
  where?: WhereOptions;
}

export interface IGetJobRolesRequest {
  query: IGetJobRolesParamsDto;
}
