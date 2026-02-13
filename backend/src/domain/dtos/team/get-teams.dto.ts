import { WhereOptions } from "sequelize";

export interface IGetTeamsParamsDto {
  page: number;
  limit: number;
  name: string;
  store: number;
  is_active: boolean;
}

export interface IGetTeamsParams {
  page: number;
  limit: number;
  where?: WhereOptions;
}

export interface IGetTeamsRequest {
  query: IGetTeamsParamsDto;
}
