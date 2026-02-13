import { WhereOptions } from "sequelize";

export interface IGetActivitiesParamsDto {
  page: number;
  limit: number;
  name: string;
  job_role: number;
  area: number;
}

export interface IGetActivitiesParams {
  page: number;
  limit: number;
  where?: WhereOptions;
}

export interface IGetActivitiesRequest {
  query: IGetActivitiesParamsDto;
}

export interface IGetActivitiesByAreaRequest {
  query: IGetActivitiesParamsDto;
  params: { id: number };
}
