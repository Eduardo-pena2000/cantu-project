export interface CreateAreaDto {
  name: string;
  store_id: number;
  manager_id: number;
}

export interface ICreateAreaRequest {
  body: CreateAreaDto;
}
