import { CreateUserDto } from "./create-user.dto";

export type IUpdateUserDto = Partial<CreateUserDto> & {
  last_login?: Date | null;
};

export interface IUpdateUserRequest {
  params: { id: number };
  body: IUpdateUserDto & { roles: number[] };
  file?: {
    buffer: Buffer;
    mimetype: string;
    originalname: string;
  };
}

export interface IAssignAreaRequest {
  body: { area_id: number; added_users: number[]; deleted_users: number[] };
}
