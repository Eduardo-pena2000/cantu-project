import { WhereOptions } from "sequelize";

export interface IGetShiftsParamsDto {
  page: number;
  limit: number;
  name: string;
  store: number;
}

export interface IGetShiftsParams {
  page?: number;
  limit?: number;
  where?: WhereOptions;
  paginate?: boolean;
}

export interface IGetShiftsRequest {
  query: IGetShiftsParamsDto;
}
