import { WhereOptions } from "sequelize";

export interface IGetAreasParamsDto {
  page: number;
  limit: number;
  name: string;
  store: number;
}

export interface IGetAreasParams {
  page: number;
  limit: number;
  where?: WhereOptions;
}

export interface IGetAreasRequest {
  query: IGetAreasParamsDto;
}
