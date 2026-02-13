import { WhereOptions } from "sequelize";

export interface IGetUsersParamsDto {
  page: number;
  limit: number;
  name: string;
  email: string;
  role: number[];
  store: number;
  area: number;
}

export interface IGetUsersParams {
  page: number;
  limit: number;
  where?: any;
}

export interface IGetUsersRequest {
  query: IGetUsersParamsDto;
}

export interface IGetUsersByScheduleRequest {
  query: IGetUsersParamsDto;
  params: { id: number };
}

export interface IGetUsersByAssistanceRequest {
  params: { id: number };
}

export interface IGetUsersWithOutTeamRequest {
  params: { id: number };
  query: { teamId: number };
}

export interface IGetUsersByActivitiesRequest {
  params: { scheduleId: number; storeId: number };
}
