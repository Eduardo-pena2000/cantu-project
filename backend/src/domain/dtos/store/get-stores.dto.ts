import { WhereOptions } from "sequelize";

export interface IGetStoresParamsDto {
  page: number;
  limit: number;
  name: string;
}

export interface IGetStoresParams {
  page: number;
  limit: number;
  where?: WhereOptions;
}

export interface IGetStoresRequest {
  query: IGetStoresParamsDto;
}
