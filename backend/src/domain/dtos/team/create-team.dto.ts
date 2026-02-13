export interface CreateTeamDto {
  name: string;
  store_id: number;
  shift_id: number;
  manager_id?: number;
  temporal_manager?: {
    id: number;
    start_date: Date;
    end_date: Date;
  };
  is_active?: boolean;
}

export interface CreateManagersDto {
  team_id: number;
  user_id: number;
  is_main_manager?: boolean;
  start_date?: Date;
  end_date?: Date;
}

export interface ICreateTeamRequest {
  body: CreateTeamDto;
}

export interface IAssignUserTeamRequest {
  body: {
    team_id: number;
    user_id: number;
    working_days: number[];
  };
}
