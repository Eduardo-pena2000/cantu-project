export interface IDeleteTeamRequest {
  params: { id: number };
}

export interface IDeleteUserOfTeamRequest {
  params: { userId: number; teamId: number };
}
